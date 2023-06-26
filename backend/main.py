from fastapi import FastAPI, HTTPException, Form
from typing import Annotated
from typing import Optional, List
from pydantic import BaseModel
from utility import get_db_conn
import routers.taskmasters
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware



class Task(BaseModel):
    title: Annotated[str, Form(...)]
    assignee_ids: Annotated[List[int], Form(...)]
    description: Optional[Annotated[str, Form(...)]] = None
    deadline: Optional[Annotated[str, Form(...)]] = None

class Assign(BaseModel):
    task_id: Annotated[int, Form(...)]
    assignee_ids: Annotated[List[int], Form(...)]


origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
    "http://localhost:8000"
]

middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=origins,
        # allow_origins=['*'],
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*']
    )
]


app = FastAPI(middleware=middleware)
app.include_router(routers.taskmasters.router)

@app.post("/create_task")
async def create_task(task: Task):
    title = task.title
    assignee_ids = task.assignee_ids
    description = task.description
    deadline = task.deadline
    
    conn = get_db_conn()
    cur = conn.cursor()
    
    # Insert the new task.
    insert_task_sql = """
        INSERT INTO tasks (title, deadline, description)
        VALUES (%s, %s, %s)
        RETURNING id
    """
    cur.execute(insert_task_sql, (title, deadline, description))
    
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

@app.post("/assign_task")
async def assign_task(
    # task_id: Annotated[int, Form(...)],
    # assignee_ids: Annotated[List[int], Form(...)],
    assign: Assign
):
    task_id = assign.task_id
    assignee_ids = assign.assignee_ids
    
    conn = get_db_conn()
    cur = conn.cursor()
    
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
    return {"detail": "Task assigned successfully",
            "task_id": task_id}

@app.get("/tasks")
def get_tasks(profile_id: Annotated[str, Form(...)]):
    
    conn = get_db_conn()
    cur = conn.cursor()
    
    select_task_list = """
    SELECT tasks.id, tasks.title FROM tasks
        JOIN task_assignees ON tasks.id = task_assignees.task_id
        JOIN profiles ON task_assignees.profile_id = profiles.id
    WHERE profiles.id = %s;
    """
    cur.execute(select_task_list, (profile_id,))
    tasks = cur.fetchall()
    
    cur.close()
    conn.close()
    
    return tasks