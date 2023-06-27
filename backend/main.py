from fastapi import FastAPI, HTTPException, Form, Depends
from typing import Annotated
from typing import List, Union
from pydantic import BaseModel
from utility import get_db_conn, oauth2_scheme
import routers.taskmasters
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from datetime import datetime
from utility import oauth2_scheme, verify_token

class Task(BaseModel):
    title: str
    assignees: List[int]
    description: Union[str, None] 
    deadline: Union[str, None]

class Edit_Task(BaseModel):
    task_id: int
    progress: Union[str, None]
    assignees: Union[List[int], None]
    unassignees: Union[List[int], None]
    title: Union[str, None]
    description: Union[str, None]
    

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
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*']
    )
]


app = FastAPI(middleware=middleware)
app.include_router(routers.taskmasters.router)

@app.post("/task")
async def create_task(task: Task, token: str = Depends(oauth2_scheme)):
    creator_id = verify_token(token)
    
    title = task.title
    assignees = task.assignees
    description = task.description
    deadline = task.deadline
    progress = "Not Started"
    initial_time = str(datetime.now().date())
    
    conn = get_db_conn()
    cur = conn.cursor()
    
    # Insert the new task.
    insert_task_sql = """
        INSERT INTO tasks (title, creator_id, deadline, description, initial_date, progress)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    """
    cur.execute(insert_task_sql, (title, creator_id, deadline, description, initial_time, progress))
    
    task_id = cur.fetchone()[0]
    
    # Insert the creator for the new task.
    insert_assignees_sql = """
        INSERT INTO task_assignees (task_id, profile_id)
        VALUES (%s, %s)
    """
    # cur.execute(insert_assignees_sql, (task_id, creator_id))

    if assignees is not None:
        for assignee in assignees:
            cur.execute(insert_assignees_sql, (task_id, assignee))
            
    conn.commit()
    
    cur.close()
    conn.close()
    

    return {"task_id": task_id}

@app.post("/edit_task")
async def edit_task(
    edit: Edit_Task, token: str = Depends(oauth2_scheme)
):  
    verify_token(token)
    request = []
    task_id = edit.task_id
    assignees = edit.assignees
    unassignees = edit.unassignees
    
    args = []
    
    if edit.progress is not None:
        request.append(('progress', edit.progress))  
    if edit.title is not None:
        request.append(('title', edit.title)) 
    if edit.description is not None:
        request.append(('description', edit.description))

    if request == []:
        return
    

    update_sql = '''
        UPDATE tasks
        SET
    '''
    
    for column, value in request:
        update_sql += f' {column} = %s,'
        args.append(value)
    
    update_sql = update_sql[:-1]
    update_sql += '\nWHERE tasks.id = %s'
    args.append(task_id)
    
    conn = get_db_conn()
    cur = conn.cursor()
    
    # update task details
    cur.execute(update_sql, tuple(args))
    
    # Insert the assignees for the new task.
    insert_assignees_sql = """
        INSERT INTO task_assignees (task_id, profile_id)
        VALUES (%s, %s)
    """
    
    remove_assignees_sql = '''
        DELETE FROM task_assignees
        WHERE task_id = %s AND profile_id = %s
    '''
    if assignees is not None:
        for assignee in assignees:
            cur.execute(insert_assignees_sql, (task_id, assignee))
    
    if unassignees is not None:
        for unassignee in unassignees:
            cur.execute(remove_assignees_sql, (task_id, unassignee))
    

    conn.commit()
    
    cur.close()
    conn.close()
    return {"detail": "Task updated successfully"}

@app.get("/tasks")
def get_tasks(is_profile: bool, id: int, token: str = Depends(oauth2_scheme)):
    user_id = verify_token(token)
    conn = get_db_conn()
    cur = conn.cursor()
    
    select_task_list = """
    SELECT tasks.id as task_id, tasks.title, tasks.description, tasks.deadline, tasks.progress
    FROM tasks               
        JOIN task_assignees ON tasks.id = task_assignees.task_id
        JOIN profiles ON task_assignees.profile_id = profiles.id
    WHERE profiles.id = %s
    """
    if is_profile and id is not None:
        user_id = id
    # elif is_profile and id is None:
    else:
        select_task_list += " OR tasks.creator_id = %s"
    select_task_list += "\nORDER BY tasks.deadline;"
    
    cur.execute(select_task_list, (user_id,))
    tasks = cur.fetchall()
    # Get column names
    column_names = [desc[0] for desc in cur.description]
    
    # Convert to list of dictionaries
    tasks = [dict(zip(column_names, task)) for task in tasks]
    
    
    select_assignees_sql = '''
    SELECT profile_id FROM task_assignees
    WHERE task_id = %s
    '''

    # Fetch assignees for each task
    for task in tasks:
        cur.execute(select_assignees_sql, (task["task_id"],))
        assignees = [item[0] for item in cur.fetchall()]
        task["assignees"] = assignees

    cur.close()
    conn.close()
    
    return tasks

