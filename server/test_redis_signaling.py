import asyncio
import json
import os
import sys
import unittest
from unittest.mock import AsyncMock, MagicMock, patch

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "aether_server"))
import redis_broker
from redis_broker import RedisBroker


class TestRedisSignaling(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.broker = RedisBroker(host="localhost", port=6379)
        self.mock_client = AsyncMock()
        self.broker._client = self.mock_client
        self.broker._connected = True

    async def test_publish_to_landlord(self):
        offer_msg = {
            "type": "CONNECTION",
            "offer": "v=0\r\no=- 12345 IN IP4 0.0.0.0...",
            "uuid": "42",
        }
        await self.broker.publish_to_landlord(landlord_id=1, message=offer_msg)

        self.mock_client.publish.assert_called_once_with(
            "aether:landlord:1", json.dumps(offer_msg)
        )

    async def test_publish_to_client(self):
        answer_msg = {
            "type": "ANSWER",
            "sdp": "v=0\r\no=- 67890 IN IP4 0.0.0.0...",
        }
        await self.broker.publish_to_client(client_uuid="42", message=answer_msg)

        self.mock_client.publish.assert_called_once_with(
            "aether:client:42", json.dumps(answer_msg)
        )

    async def test_register_and_unregister_landlord(self):
        await self.broker.register_active_landlord(
            landlord_id=1, token="dummy_token", is_active=False
        )
        self.mock_client.hset.assert_called_once_with(
            "aether:active_landlords",
            "1",
            json.dumps({"user_id": 1, "identification": "dummy_token", "active": False}),
        )

        await self.broker.unregister_active_landlord(landlord_id=1)
        self.mock_client.hdel.assert_any_call("aether:active_landlords", "1")
        self.mock_client.hdel.assert_any_call("aether:landlord_specs", "1")

    async def test_broadcast_specifications(self):
        specs = {
            "display": {"width": 1920, "height": 1080, "frame_rate": 60},
            "device": {"cpu": [{"name": "Ryzen 9", "size": 16}]},
        }
        self.mock_client.hgetall.return_value = {
            "1": json.dumps(specs)
        }

        await self.broker.broadcast_specifications(landlord_id=1, specs=specs)

        self.mock_client.hset.assert_called_once_with(
            "aether:landlord_specs", "1", json.dumps(specs)
        )
        self.mock_client.publish.assert_called_once_with(
            "aether:broadcast:specs",
            json.dumps({
                "type": "DEVICES",
                "devices": [{"landlord_id": 1, "info": specs}],
                "updated_landlord_id": 1,
            }),
        )


if __name__ == "__main__":
    unittest.main()
