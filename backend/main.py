from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.security import OAuth2PasswordBearer
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Union, Optional, Annotated
from datetime import datetime
import logging
import routers.profiles, routers.connections, routers.chat
from utility import oauth2_scheme, verify_token, get_db_conn, oauth2_scheme
from task_estimation import get_task_estimate

class User_profile(BaseModel):
    u_id: int
    email: str
    first_name: str
    last_name: str
class Task(BaseModel):
    title: str
    assignees: Union[List[User_profile], None]
    description: Union[str, None] 
    deadline: Union[str, None]
    mean: Union[str, None]
    stddev: Union[str, None]

class Edit_Task(BaseModel):
    task_id: int
    progress: Union[str, None]
    assignees: Union[List[User_profile], None]
    title: Union[str, None]
    description: Union[str, None]
    mean: Union[str, None]
    stddev: Union[str, None]
    
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
app.include_router(routers.profiles.router)
app.include_router(routers.connections.router)
app.include_router(routers.chat.router)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    exc_str = f'{exc}'.replace('\n', ' ').replace('   ', ' ')
    logging.error(f"{request}: {exc_str}")
    content = {'status_code': 10422, 'message': exc_str, 'data': None}
    return JSONResponse(content=content, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)

@app.post("/task")
async def create_task(task: Task, token: str = Depends(oauth2_scheme)):
    creator_id = verify_token(token)
    
    title = task.title
    assignees = task.assignees
    description = task.description
    deadline = task.deadline
    progress = "Not Started"
    mean = task.mean
    stddev = task.stddev
    initial_time = str(datetime.now().date())
    
    conn = get_db_conn()
    cur = conn.cursor()
    
    # Insert the new task.
    insert_task_sql = """
        INSERT INTO tasks (title, creator_id, deadline, description, initial_date, progress, mean, stddev)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    """
    cur.execute(insert_task_sql, (title, creator_id, deadline, description, initial_time, progress, mean, stddev))
    
    task_id = cur.fetchone()[0]
    
    # Insert the creator for the new task.
    insert_assignees_sql = """
        INSERT INTO task_assignees (task_id, profile_id)
        VALUES (%s, %s)
    """
    # cur.execute(insert_assignees_sql, (task_id, creator_id))

    if assignees is not None:
        for assignee in assignees:
            u_id = assignee.u_id
            cur.execute(insert_assignees_sql, (task_id, u_id))
            
    conn.commit()
    
    cur.close()
    conn.close()
    

    return {"task_id": task_id}

@app.put("/edit_task")
async def edit_task(
    edit: Edit_Task, token: str = Depends(oauth2_scheme)
):  
    verify_token(token)
    request = []
    task_id = edit.task_id
    assignees = edit.assignees
    # unassignees = edit.unassignees
    
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
        WHERE task_id = %s
    '''
    
    # Remove old assign records and create new ones
    if assignees is not None:
        
        cur.execute(remove_assignees_sql, (task_id,))
        for assignee in assignees:
            assignee_id = assignee.u_id
            cur.execute(insert_assignees_sql, (task_id, assignee_id))
    

    conn.commit()
    
    cur.close() 
    conn.close()
    return {"detail": "Task updated successfully"}

@app.get("/tasks")
def get_tasks(page: str , profile_id: Union[int, None] = None, token: str = Depends(oauth2_scheme)):
    user_id = verify_token(token)
    conn = get_db_conn()
    cur = conn.cursor()
    
    if profile_id is not None:
        user_id = int(profile_id)
    
    select_task_list = None

    if page == 'profile':
        select_task_list = """
        SELECT tasks.id as task_id, tasks.title, tasks.description, tasks.deadline, tasks.progress
        FROM tasks               
            JOIN task_assignees ON tasks.id = task_assignees.task_id
            JOIN profiles ON task_assignees.profile_id = profiles.id
        WHERE profiles.id = %s
        ORDER BY tasks.deadline;
        """
        cur.execute(select_task_list, (user_id,))
    elif page == 'dashboard':
        select_task_list = """
        SELECT tasks.id as task_id, tasks.title, tasks.description, tasks.deadline, tasks.progress
        FROM tasks               
            LEFT OUTER JOIN task_assignees ON tasks.id = task_assignees.task_id
            LEFT OUTER JOIN profiles ON task_assignees.profile_id = profiles.id
        WHERE profiles.id = %s OR tasks.creator_id = %s
        ORDER BY tasks.deadline;
        """
        cur.execute(select_task_list, (user_id, user_id))
    else:
        raise HTTPException
    tasks = cur.fetchall()
    # Get column names
    column_names = [desc[0] for desc in cur.description]
    
    # Convert to list of dictionaries
    tasks_dict = {task[0]: dict(zip(column_names, task)) for task in tasks}
    
    select_assignees_sql = '''
    SELECT p.id, p.email_address as email, p.first_name as first_name, p.last_name as last_name, p.image as img 
    FROM task_assignees t
        JOIN PROFILES p on p.id = t.profile_id
    WHERE t.task_id = %s
    '''

    # Fetch assignees for each task
    for task_id, task in tasks_dict.items():
        cur.execute(select_assignees_sql, (task_id,))
        # assignees = [item[0] for item in cur.fetchall()]
        assignees = [User_profile(u_id=item[0], email=item[1], first_name=item[2], last_name=item[3]) for item in cur.fetchall()]
        task["assignees"] = assignees

    # Convert back to a list
    tasks = list(tasks_dict.values())

    cur.close()
    conn.close()

    return tasks

@app.delete("/task")
def delete_task(task_id: int, token: str = Depends(oauth2_scheme)):
    # TODO: Only the task creator can delete teh task
    user_id = verify_token(token)
    conn = get_db_conn()
    cur = conn.cursor()
    
    # Check if the user is the creator of the task
    checkCreatorSQL = """
        SELECT * FROM TASKS
        WHERE id = %s AND CREATOR_ID = %s
    """
    cur.execute(checkCreatorSQL, (task_id, user_id))
    result = cur.fetchone()
    if result is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to delete this task")

    deleteTaskAssigneesSQL = """
        DELETE FROM TASK_ASSIGNEES 
        WHERE task_id = %s
    """
    cur.execute(deleteTaskAssigneesSQL, (task_id,))
    
    deleteTaskSQL = """
        DELETE FROM TASKS
        WHERE id = %s
    """
    cur.execute(deleteTaskSQL, (task_id,))
    
    conn.commit()
    
    cur.close()
    conn.close()


@app.get("/task_estimation")
async def task_estimation(title: str, desc : Union[str, None], token: str = Depends(oauth2_scheme)):
    return get_task_estimate(title, desc)
