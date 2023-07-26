from fastapi import APIRouter, HTTPException, WebSocket, Depends
from typing import List, Dict
from utility import get_db_conn, oauth2_scheme, verify_token
from datetime import datetime
import json


router = APIRouter()

connected_clients: Dict[int, List[WebSocket]] = {}

@router.websocket("/ws")
async def websocket_endpoint(task_id: int, websocket: WebSocket):
    
    await websocket.accept()
    # initialized list for given task_id if not exist already
    if task_id not in connected_clients:
        connected_clients[task_id] = []
    
    connected_clients[task_id].append(websocket)
    
    try:
        conn = get_db_conn()
        cur = conn.cursor()
        while True:
            # receive data from user
            data = await websocket.receive_text()
            message = json.loads(data)
            text = message.get('text')
            profile_id = message.get('profile_id')
            currentTime = datetime.now().time()
            # save messages
            saveMessageSQL = """
            INSERT INTO MESSAGES (profile_id, task_id, content, time_send)
            VALUES (%s, %s, %s, %s);
            """
            cur.execute(saveMessageSQL, (profile_id, task_id, text, currentTime))
            conn.commit()

            # propagate text message to relavent users
            for client in connected_clients[task_id]:
                await client.send_text(text)
        
    except Exception as e:
        print(e)
    finally:
        cur.close()
        conn.close()
        connected_clients[task_id].remove(websocket)


@router.get("/messages")
async def get_messages(task_id: int, token: str = Depends(oauth2_scheme)):
    user_id = verify_token(token)
    
    # get messages in order of sending time
    fetch_messageSQL = """
    SELECT m.content from MESSAGES m
        JOIN TASKS t ON t.id = m.task_id
    WHERE t.id = %s
    ORDER BY m.time_send
    """
    conn = get_db_conn()
    cur = conn.cursor()
    
    cur.execute(fetch_messageSQL, (task_id,))
    result = cur.fetchall()
    messages = []
    
    # get a list of messages
    for message in result:
        messages.append(message[0])
    
    cur.close()
    conn.close()
    return messages



