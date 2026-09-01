import asyncio
import json
import logging
import os
from typing import Any, AsyncGenerator, Dict, List, Optional

try:
    import redis.asyncio as aioredis
    from redis.asyncio.client import PubSub
except ImportError:
    aioredis = None
    PubSub = Any

logger = logging.getLogger(__name__)

REDIS_POOL_APPKEY = "redis_broker"


class RedisBroker:
    """
    Asynchronous Redis Broker for WebRTC Signaling, Pub/Sub channels,
    and distributed presence tracking across multiple server instances.
    """

    LANDLORD_CHANNEL_PREFIX = "aether:landlord:"
    CLIENT_CHANNEL_PREFIX = "aether:client:"
    BROADCAST_SPECS_CHANNEL = "aether:broadcast:specs"

    ACTIVE_LANDLORDS_HASH = "aether:active_landlords"
    PENDING_LANDLORDS_HASH = "aether:pending_landlords"
    LANDLORD_SPECS_HASH = "aether:landlord_specs"

    def __init__(
        self,
        host: Optional[str] = None,
        port: Optional[int] = None,
        password: Optional[str] = None,
        db: int = 0,
        url: Optional[str] = None,
    ):
        self.host = host or os.getenv("REDIS_HOST", "localhost")
        self.port = int(port or os.getenv("REDIS_PORT", 6379))
        self.password = password or os.getenv("REDIS_PASSWORD", None)
        self.db = int(os.getenv("REDIS_DB", db))
        self.url = url or os.getenv("REDIS_URL", None)

        self._client: Optional[aioredis.Redis] = None
        self._connected = False

    @property
    def is_connected(self) -> bool:
        return self._connected and self._client is not None

    async def initialize(self) -> bool:
        """Initialize connection pool to Redis."""
        try:
            if self.url:
                self._client = aioredis.from_url(
                    self.url,
                    decode_responses=True,
                    health_check_interval=30,
                )
            else:
                self._client = aioredis.Redis(
                    host=self.host,
                    port=self.port,
                    password=self.password if self.password else None,
                    db=self.db,
                    decode_responses=True,
                    health_check_interval=30,
                )

            await self._client.ping()
            self._connected = True
            logger.info("___RedisBroker connected successfully to Redis.")
            return True
        except Exception as err:
            self._connected = False
            logger.warning(f"___RedisBroker could not connect to Redis: {err}")
            return False

    async def close(self) -> None:
        """Close the Redis client connection."""
        if self._client:
            await self._client.aclose()
            self._connected = False
            logger.info("___RedisBroker connection closed.")

    # ------------------------------------------------------------------
    # Presence & State Management
    # ------------------------------------------------------------------

    async def save_pending_landlord(
        self, token: str, user_id: int, expiry_seconds: int = 7200
    ) -> None:
        """Stores identification token for landlord verification."""
        if not self.is_connected:
            return None
        payload = json.dumps({"user_id": user_id, "token": token})
        await self._client.hset(self.PENDING_LANDLORDS_HASH, token, payload)
        await self._client.set(f"aether:token:{token}", payload, ex=expiry_seconds)

    async def get_pending_landlord(self, token: str) -> Optional[Dict[str, Any]]:
        """Retrieves landlord registration by token."""
        if not self.is_connected:
            return None
        data = await self._client.hget(self.PENDING_LANDLORDS_HASH, token)
        if data:
            return json.loads(data)
        return None

    async def register_active_landlord(
        self, landlord_id: int, token: str, is_active: bool = False
    ) -> None:
        """Registers an active landlord connection globally."""
        if not self.is_connected:
            return None
        payload = json.dumps(
            {
                "user_id": landlord_id,
                "identification": token,
                "active": is_active,
            }
        )
        await self._client.hset(self.ACTIVE_LANDLORDS_HASH, str(landlord_id), payload)

    async def set_landlord_active_state(
        self, landlord_id: int, is_active: bool
    ) -> None:
        """Updates the active flag (e.g. when streaming session starts)."""
        if not self.is_connected:
            return
        data = await self._client.hget(self.ACTIVE_LANDLORDS_HASH, str(landlord_id))
        if data:
            record = json.loads(data)
            record["active"] = is_active
            await self._client.hset(
                self.ACTIVE_LANDLORDS_HASH, str(landlord_id), json.dumps(record)
            )

    async def unregister_active_landlord(self, landlord_id: int) -> None:
        """Removes landlord from active hosts."""
        if not self.is_connected:
            return
        await self._client.hdel(self.ACTIVE_LANDLORDS_HASH, str(landlord_id))
        await self._client.hdel(self.LANDLORD_SPECS_HASH, str(landlord_id))

    async def save_landlord_specification(
        self, landlord_id: int, specs: Dict[str, Any]
    ) -> None:
        """Saves hardware/display specifications in Redis."""
        if not self.is_connected:
            return
        await self._client.hset(
            self.LANDLORD_SPECS_HASH, str(landlord_id), json.dumps(specs)
        )

    async def get_all_specifications(self) -> List[Dict[str, Any]]:
        """Returns a list of all active landlord specs."""
        if not self.is_connected:
            return []
        all_specs_raw = await self._client.hgetall(self.LANDLORD_SPECS_HASH)
        specs_list = []
        for landlord_id_str, spec_json in all_specs_raw.items():
            try:
                specs_list.append(
                    {
                        "landlord_id": int(landlord_id_str),
                        "info": json.loads(spec_json),
                    }
                )
            except Exception:
                continue
        return specs_list

    # ------------------------------------------------------------------
    # Pub/Sub Messaging
    # ------------------------------------------------------------------

    async def publish_to_landlord(
        self, landlord_id: int, message: Dict[str, Any]
    ) -> int:
        """Publishes a signaling message (e.g. SDP Offer, Control) to a specific landlord."""
        if not self.is_connected:
            return 0
        channel = f"{self.LANDLORD_CHANNEL_PREFIX}{landlord_id}"
        return await self._client.publish(channel, json.dumps(message))

    async def publish_to_client(self, client_uuid: str, message: Dict[str, Any]) -> int:
        """Publishes a signaling message (e.g. SDP Answer, Control ACK) to a specific client."""
        if not self.is_connected:
            return 0
        channel = f"{self.CLIENT_CHANNEL_PREFIX}{client_uuid}"
        return await self._client.publish(channel, json.dumps(message))

    async def broadcast_specifications(
        self, landlord_id: int, specs: Dict[str, Any]
    ) -> int:
        """Broadcasts hardware specifications to all connected server nodes and clients."""
        if not self.is_connected:
            return 0
        await self.save_landlord_specification(landlord_id, specs)
        all_specs = await self.get_all_specifications()
        payload = {
            "type": "DEVICES",
            "devices": all_specs,
            "updated_landlord_id": landlord_id,
        }
        return await self._client.publish(
            self.BROADCAST_SPECS_CHANNEL, json.dumps(payload)
        )

    def create_pubsub(self) -> Optional[PubSub]:
        """Creates a dedicated PubSub instance for subscription."""
        if not self.is_connected:
            return None
        return self._client.pubsub()
