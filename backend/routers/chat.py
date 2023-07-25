from fastapi import APIRouter, WebSocket
from typing import List
import json

router = APIRouter()

connected_clients: List[WebSocket] = []

messages = [{'text': "yo waddup", 'profile_first_name': 'Lucas'}, {'text': 'the sky', 'profile_first_name' : 'Jordan'}]

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # PERSIST THE DATA IN SOME WAY (json.loads(data))
            # GET FIRST NAME FROM ID AND PROPAGATE TO CONNECTED CLIENTS
            for client in connected_clients:
                await client.send_text(data)
    except Exception as e:
        print(e)
    finally:
        connected_clients.remove(websocket)

@router.get("/messages")
async def get_messages():
    return messages