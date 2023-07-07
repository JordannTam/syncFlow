from fastapi import APIRouter, HTTPException, Depends, status
from typing import Union
from utility import get_db_conn, oauth2_scheme
from pydantic import BaseModel
from typing import List, Union, Optional
from utility import verify_token
from pydantic import BaseModel
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

router = APIRouter()

class Connection_request_Management(BaseModel):
    sender_id: int
    receiver_id: int
    decision: str
    
@router.post("/send_connection_request")
def sent_connection_request(email: str, token: str = Depends(oauth2_scheme)):
    
    id1 = verify_token(token)
    
    conn = get_db_conn()
    cur = conn.cursor()
    
    # Check if the email is valid
    cur.execute("SELECT id FROM profiles WHERE email_address=%s", (email,))
    
    id2 = cur.fetchone()

    if id2 is None:
        raise HTTPException(status_code=400, detail="Email does not Exist")
    
    add_connection_request = """
        INSERT INTO connection_requests (id1, id2)
        VALUES (%s, %s)
    """
    
    cur.execute(add_connection_request, (id1, id2))
    
    conn.commit()
    
    cur.close()
    conn.close()
    
    return {'sender_id': id1,
            'receiver_id': id2}

@router.post("/connection_request_management")
def manage_connection_request(management: Connection_request_Management, token: str = Depends(oauth2_scheme)):
    
    # receiver_id
    receiver_id = verify_token(token)
    sender_id = management.sender_id
    decision = management.decision
    
    conn = get_db_conn()
    cur = conn.cursor()
    
    RemoveRequestRecordSQL = """
            DELETE FROM CONNECTION_REQUESTS 
            WHERE sender_id = %s AND receiver_id = %s
        """
    cur.execute(RemoveRequestRecordSQL, (sender_id, receiver_id))
        
    if decision == "REJECT":
        #TODO: Notify sender connection requst fails
        pass
    elif decision == "ACCEPT":
        EstablishConnectionSQL = """
            INSERT INTO CONNECTIONS (id1, id2)
            VALUES (%s, %s)
        """
        cur.execute(EstablishConnectionSQL, (sender_id, receiver_id))
    
    conn.commit()
    
    cur.close()
    conn.close()
    
    return {'sender_id': sender_id,
            'receiver_id': receiver_id}

def send_email(to: str, id: int):
    subject = "Connection Request"
    body = f"Hi! \nYou have a connection request From: {id}"
    message = MIMEMultipart()
    message["From"] = "your_email@gmail.com"
    message["To"] = to
    message["Subject"] = subject

    # Add body to email
    message.attach(MIMEText(body, "plain"))

    text = message.as_string()

    # Log in to server using secure context and send email
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login("msgsend1@gmail.com", "oniniqkytxhpxwhv")
        server.sendmail("msgsend1@gmail.com", to, text)