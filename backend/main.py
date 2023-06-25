from fastapi import FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import hashlib
from typing import Annotated
from typing import Optional, List


app = FastAPI()

origins = [
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_conn():
    conn = psycopg2.connect(
        dbname="endgame",
        user="teamendgame",
        host="localhost",
        password="password"
    )
    return conn

app = FastAPI()

@app.post("/register")
async def register(
    email: Annotated[str, Form(...)], 
    first_name: Annotated[str, Form(...)], 
    last_name: Annotated[str, Form(...)], 
    password: Annotated[str, Form(...)]
):
    print(email, first_name, last_name, password)
    conn = get_db_conn()
    cur = conn.cursor()

    cur.execute(f"SELECT * FROM profiles WHERE email_address='{email}'")
    if cur.fetchone() is not None:
        raise HTTPException(status_code=400, detail="Email already in use")

    hashed = hashlib.md5(password.encode()).hexdigest()

    cur.execute(f"INSERT INTO profiles (email_address, first_name, last_name, password_hash) VALUES ('{email}', '{first_name}', '{last_name}', '{hashed}')")
    conn.commit()
    cur.close()
    conn.close()

    return {"detail": "User registered"}

@app.post("/login")
async def login(
    email: Annotated[str, Form(...)], 
    password: Annotated[str, Form(...)]
):
    conn = get_db_conn()
    cur = conn.cursor()

    cur.execute(f"SELECT * FROM profiles WHERE email_address='{email}'")
    user = cur.fetchone()
    if user is None:
        raise HTTPException(status_code=401, detail="Email not found")

    cur.execute(f"SELECT password_hash FROM profiles WHERE email_address='{email}'")
    hashed = cur.fetchone()[0]
    if hashlib.md5(password.encode()).hexdigest() != hashed:
        raise HTTPException(status_code=401, detail="Incorrect password")

    cur.close()
    conn.close()

    return {"jwt token": "TODO"} # TODO

@app.post("/create_task")
async def create_task(
    title: Annotated[List[int], Form(...)],
    assignee_ids: Annotated[str, Form(...)],
    deadline: Optional[Annotated[str, Form(...)]] = None,
    description: Optional[Annotated[str, Form(...)]] = None,
):
    conn = get_db_conn()
    cur = conn.cursor()
    
    # Insert the new task.
    insert_task_sql = """
        INSERT INTO tasks (deadline, description)
        VALUES (%s, %s)
        RETURNING id
    """
    cur.execute(insert_task_sql, (deadline, description))
    task_id = cur.fetchone()[0]
    
    # Insert the assignees for the new task.
    insert_assignees_sql = """
        INSERT INTO task_assignees (task_id, profile_id)
        VALUES (%s, %s)
    """
    for assignee_id in assignee_ids:
        cur.execute(insert_assignees_sql, (task_id, assignee_id))

    conn.commit()
    
    cur.close()
    conn.close()
    

    return {"detail": "Task created successfully"}