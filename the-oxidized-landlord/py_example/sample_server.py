"""
A sample server using aiohttp that auto-handles
connection cases.
"""
import asyncio
import logging
import pathlib
import uuid

import aiohttp.web as web

logging.basicConfig(level=logging.DEBUG)


def validate_json_fields(data: dict, fields: list[str]) -> bool:
    return all(field in data for field in fields)


class PeerManager:
    def __init__(self, ws: web.WebSocketResponse) -> None:
        self.__uuids: set[uuid.UUID] = set()
        self.__ws = ws

        self.__answer_futures: dict[uuid.UUID, asyncio.Future[str]] = {}

    async def __send_json(self, data: dict) -> None:
        return await self.__ws.send_json(data)

    async def add_peer(self, peer_uuid: uuid.UUID, offer: dict):
        self.__uuids.add(peer_uuid)
        await self.__send_json(
            {
                "type": "CONNECTION",
                "uuid": peer_uuid.hex,
                "offer": offer,
            }
        )

        self.__answer_futures[peer_uuid] = asyncio.Future()
        return await self.__answer_futures[peer_uuid]

    async def remove_peer(self, peer_uuid: uuid.UUID) -> None:
        self.__uuids.remove(peer_uuid)
        await self.__send_json({"type": "DISCONNECT", "uuid": peer_uuid.hex})

    def set_answer_for_peer(self, peer_uuid: uuid.UUID, answer: str) -> None:
        self.__answer_futures[peer_uuid].set_result(answer)

    @property
    def peers(self) -> set[uuid.UUID]:
        return self.__uuids.copy()


landlord_instances: dict[uuid.UUID, PeerManager] = {}


v1_landlord_routes = web.RouteTableDef()
v1_frontend_routes = web.RouteTableDef()


@v1_landlord_routes.get("/v1/landlord/ws")
async def websocket_handler(request: web.Request) -> web.WebSocketResponse:
    # Not checking tokens on purpose.
    ws = web.WebSocketResponse()

    await ws.prepare(request)

    peer_manager = PeerManager(ws)
    landlord_instances[uuid.uuid4()] = peer_manager

    async for msg in ws:
        match msg.type:
            case web.WSMsgType.TEXT:
                data = msg.json()

                match data["type"]:
                    case "CONNECTION_MADE":
                        peer_manager.set_answer_for_peer(
                            uuid.UUID(data["uuid"]), data["sdp_answer"]
                        )

            case web.WSMsgType.ERROR:
                break


@v1_frontend_routes.put("/v1/login/peers")
async def add_peer(request: web.Request) -> web.Response:
    data = await request.json()

    if not validate_json_fields(data, ["landlord_uuid", "offer"]):
        raise web.HTTPBadRequest("Could not validate JSON fields.")

    peer_uuid = uuid.uuid4()

    landlord = landlord_instances[uuid.UUID(data["landlord_uuid"])]
    answer = await landlord.add_peer(peer_uuid, data["offer"])

    return web.json_response({"answer": answer, "identity": peer_uuid.hex})


@v1_frontend_routes.get("/v1/login/peers")
async def get_peers(request: web.Request) -> web.Response:
    return web.json_response(
        list(
            {
                "landlord_uuid": landlord.hex,
                "peers": list(peer.hex for peer in manager.peers),
            }
            for landlord, manager in landlord_instances.items()
        )
    )


@v1_frontend_routes.delete("/v1/login/peers")
async def remove_peer(request: web.Request) -> web.Response:
    data = await request.json()

    if not validate_json_fields(data, ["landlord_uuid", "peer_uuid"]):
        raise web.HTTPBadRequest(reason="Could not validate JSON fields")

    landlord = landlord_instances[uuid.UUID(data["landlord_uuid"])]
    await landlord.remove_peer(uuid.UUID(data["peer_uuid"]))

    raise web.HTTPOk()


app = web.Application()
app.add_routes(v1_landlord_routes)
app.add_routes(v1_frontend_routes)


async def index(request):
    return web.FileResponse("./example_index/index.html")


app.add_routes(
    [
        web.get("/", index),
        web.get("/index.html", index),
    ]
)

app.router.add_static(
    "/static/", path=pathlib.Path("./example_index/static/"), name="static"
)

if __name__ == "__main__":
    web.run_app(app, host="0.0.0.0", port=7878)
