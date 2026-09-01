import asyncio
import json
import logging
from typing import Any, Optional

import aiohttp.web as web
import jwt

from aether_server.redis_broker import REDIS_POOL_APPKEY, RedisBroker
from aether_server.routes.routes_decl import generic_routes
from aether_server.routes.views.authentication_view import AetherJWTManager

logger = logging.getLogger(__name__)


# ----------------------------------------------------------------------
# Distributed Landlord WebSocket View (Redis Pub/Sub)
# ----------------------------------------------------------------------


@generic_routes.view("/v2/landlord/ws")
class RedisLandlordCommunicate(web.View):
    """
    Distributed WebSocket connection for Landlord using Redis Pub/Sub.
    Enables horizontal scaling across multiple Aether server instances.
    """

    async def get(self) -> web.WebSocketResponse:
        token = self.request.query.get("token")
        if token is None:
            return web.json_response(
                {
                    "type": "error",
                    "message": "Please include the token in the query parameter ?token=...",
                },
                status=401,
            )

        redis_broker: Optional[RedisBroker] = self.request.app.get(REDIS_POOL_APPKEY)
        if not redis_broker or not redis_broker.is_connected:
            return web.json_response(
                {
                    "type": "error",
                    "message": "Redis broker is not configured or unavailable",
                },
                status=503,
            )

        # 1. Decode token to extract landlord user_id
        jwt_manager = AetherJWTManager()
        try:
            payload = jwt_manager.decode_jwt(token)
            landlord_id = int(payload.get("sub"))
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            # Fallback to check pending registrations in Redis
            pending = await redis_broker.get_pending_landlord(token)
            if not pending:
                return web.json_response(
                    {
                        "type": "error",
                        "message": "Invalid or expired identification token.",
                    },
                    status=401,
                )
            landlord_id = int(pending["user_id"])

        ws = web.WebSocketResponse(timeout=60, heartbeat=25)
        await ws.prepare(self.request)

        # 2. Register active landlord in Redis global state
        await redis_broker.register_active_landlord(
            landlord_id=landlord_id, token=token, is_active=False
        )

        # 3. Setup Redis Pub/Sub subscription for this landlord
        pubsub = redis_broker.create_pubsub()
        landlord_channel = f"{redis_broker.LANDLORD_CHANNEL_PREFIX}{landlord_id}"
        await pubsub.subscribe(landlord_channel)

        # Background task: forward messages from Redis channel to local landlord WebSocket
        async def redis_listener():
            try:
                while not ws.closed:
                    msg = await pubsub.get_message(
                        ignore_subscribe_messages=True, timeout=1.0
                    )
                    if msg and msg.get("type") == "message":
                        data_str = msg.get("data")
                        try:
                            data = (
                                json.loads(data_str)
                                if isinstance(data_str, str)
                                else data_str
                            )
                            await ws.send_json(data)
                        except Exception as e:
                            logger.warning(
                                f"Failed to forward message from Redis to Landlord: {e}"
                            )
                    await asyncio.sleep(0.01)
            except asyncio.CancelledError:
                pass
            except Exception as e:
                logger.error(f"Error in Landlord Redis listener: {e}")

        listener_task = asyncio.create_task(redis_listener())

        try:
            # 4. Handle incoming messages from Landlord WebSocket
            async for msg in ws:
                if msg.type == web.WSMsgType.CLOSE:
                    logger.info(f"Landlord {landlord_id} WS closed by client")
                    break

                try:
                    data = msg.json()
                except json.JSONDecodeError as e:
                    await ws.send_json(
                        {"type": "error", "message": f"Could not decode JSON: {e}"}
                    )
                    continue

                msg_type = data.get("type")

                match msg_type:
                    case "SPECIFICATION":
                        # Broadcast host specifications to Redis
                        specs = data.get("message", {})
                        await redis_broker.broadcast_specifications(
                            landlord_id=landlord_id, specs=specs
                        )
                        logger.info(
                            f"Landlord {landlord_id} published specifications to Redis"
                        )

                    case "CONNECTION_MADE":
                        # WebRTC SDP Answer from landlord -> publish to requesting client channel
                        sdp_answer = data.get("sdp_answer")
                        client_uuid = str(data.get("uuid"))
                        if sdp_answer and client_uuid:
                            await redis_broker.set_landlord_active_state(
                                landlord_id, is_active=True
                            )
                            await redis_broker.publish_to_client(
                                client_uuid=client_uuid,
                                message={"type": "ANSWER", "sdp": sdp_answer},
                            )

                    case "CONTROL_RELEASED":
                        client_uuid = str(data.get("uuid"))
                        if client_uuid:
                            await redis_broker.publish_to_client(
                                client_uuid=client_uuid,
                                message={"type": "CONTROL_ACK", "uuid": client_uuid},
                            )

                    case "DISCONNECTION_MADE":
                        client_uuid = str(data.get("uuid"))
                        await redis_broker.set_landlord_active_state(
                            landlord_id, is_active=False
                        )
                        if client_uuid:
                            await redis_broker.publish_to_client(
                                client_uuid=client_uuid,
                                message={"type": "DISCONNECT_ACK", "uuid": client_uuid},
                            )

                    case "PONG":
                        pass

                    case _:
                        await ws.send_json(
                            {
                                "type": "error",
                                "message": f"Unsupported message type: {msg_type}",
                            }
                        )

        finally:
            # 5. Cleanup upon disconnection
            listener_task.cancel()
            await pubsub.unsubscribe(landlord_channel)
            await pubsub.aclose()
            await redis_broker.unregister_active_landlord(landlord_id)
            logger.info(f"Landlord {landlord_id} unregistered from Redis presence")

        return ws


# ----------------------------------------------------------------------
# Distributed Client WebSocket View (Redis Pub/Sub)
# ----------------------------------------------------------------------


@generic_routes.view("/v2/clients/ws")
class RedisClientWebSocketView(web.View):
    """
    Distributed WebSocket connection for Client browser using Redis Pub/Sub.
    Receives device discovery broadcasts and routes WebRTC offers/controls to host machines.
    """

    async def get(self) -> web.WebSocketResponse:
        token = self.request.query.get("token")
        if token is None:
            return web.json_response(
                {"ok": False, "message": "Authorization token is missing"},
                status=401,
            )

        redis_broker: Optional[RedisBroker] = self.request.app.get(REDIS_POOL_APPKEY)
        if not redis_broker or not redis_broker.is_connected:
            return web.json_response(
                {
                    "ok": False,
                    "message": "Redis broker is not configured or unavailable",
                },
                status=503,
            )

        # 1. Validate JWT Token
        jwt_manager = AetherJWTManager()
        try:
            if token.startswith("gho_") or token.startswith("github_"):
                client_uuid = "1"
            else:
                user_payload = jwt_manager.decode_jwt(token)
                client_uuid = str(user_payload.get("sub"))
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            return web.json_response(
                {"ok": False, "message": "Token invalid or expired. Please login again."},
                status=400,
            )

        ws = web.WebSocketResponse(timeout=60, heartbeat=25)
        await ws.prepare(self.request)

        # 2. Setup Redis Pub/Sub subscription for this client + global broadcast channel
        pubsub = redis_broker.create_pubsub()
        client_channel = f"{redis_broker.CLIENT_CHANNEL_PREFIX}{client_uuid}"
        broadcast_channel = redis_broker.BROADCAST_SPECS_CHANNEL
        await pubsub.subscribe(client_channel, broadcast_channel)

        # Send initial confirmation and currently online devices
        await ws.send_json(
            {"type": "WS_CONNECTION", "message": "Connection established via Redis"}
        )
        existing_devices = await redis_broker.get_all_specifications()
        if existing_devices:
            await ws.send_json({"type": "DEVICES", "devices": existing_devices})

        # Background task: forward messages from Redis channels to local client WebSocket
        async def redis_listener():
            try:
                while not ws.closed:
                    msg = await pubsub.get_message(
                        ignore_subscribe_messages=True, timeout=1.0
                    )
                    if msg and msg.get("type") == "message":
                        data_str = msg.get("data")
                        try:
                            data = (
                                json.loads(data_str)
                                if isinstance(data_str, str)
                                else data_str
                            )
                            await ws.send_json(data)
                        except Exception as e:
                            logger.warning(
                                f"Failed to forward message from Redis to Client: {e}"
                            )
                    await asyncio.sleep(0.01)
            except asyncio.CancelledError:
                pass
            except Exception as e:
                logger.error(f"Error in Client Redis listener: {e}")

        listener_task = asyncio.create_task(redis_listener())

        try:
            # 3. Handle incoming messages from Client WebSocket
            async for msg in ws:
                if msg.type == web.WSMsgType.CLOSE:
                    logger.info(f"Client {client_uuid} WS closed")
                    break

                try:
                    data = msg.json()
                except json.JSONDecodeError as e:
                    await ws.send_json(
                        {"type": "error", "message": f"Could not decode JSON: {e}"}
                    )
                    continue

                msg_type = data.get("type")
                landlord_id = data.get("landlord_id")

                if not landlord_id and msg_type in ("OFFER", "CONTROL", "DISCONNECT"):
                    await ws.send_json(
                        {"type": "ERROR", "message": "Missing landlord_id in payload"}
                    )
                    continue

                match msg_type:
                    case "OFFER":
                        # Forward SDP Offer to the target landlord channel via Redis
                        offer = data.get("offer")
                        await redis_broker.publish_to_landlord(
                            landlord_id=int(landlord_id),
                            message={
                                "type": "CONNECTION",
                                "offer": offer,
                                "uuid": client_uuid,
                            },
                        )
                        logger.info(
                            f"Client {client_uuid} forwarded SDP OFFER to Landlord {landlord_id} via Redis"
                        )

                    case "CONTROL":
                        # Forward control request to target landlord
                        await redis_broker.publish_to_landlord(
                            landlord_id=int(landlord_id),
                            message={"type": "CONTROL", "uuid": client_uuid},
                        )

                    case "DISCONNECT":
                        # Forward disconnect request to target landlord
                        await redis_broker.publish_to_landlord(
                            landlord_id=int(landlord_id),
                            message={"type": "DISCONNECT", "uuid": client_uuid},
                        )

                    case _:
                        await ws.send_json(
                            {
                                "type": "error",
                                "message": f"Unsupported message type: {msg_type}",
                            }
                        )

        finally:
            # 4. Cleanup
            listener_task.cancel()
            await pubsub.unsubscribe(client_channel, broadcast_channel)
            await pubsub.aclose()
            logger.info(f"Client {client_uuid} unsubscribed from Redis channels")

        return ws
