from fastapi import APIRouter, Depends, HTTPException, status
from typing import Union, List
from utility import oauth2_scheme, verify_token, get_db_conn
from pydantic import BaseModel
from datetime import datetime

class User_profile(BaseModel):
    u_id: int
    email: str
    first_name: str
    last_name: str
    image: Union[str, None]
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
    deadline: Union[str, None]
    mean: Union[str, None]
    stddev: Union[str, None]

router = APIRouter()

# create tasks with details given
@router.post("/task")
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

    if assignees is not None:
        for assignee in assignees:
            u_id = assignee.u_id
            cur.execute(insert_assignees_sql, (task_id, u_id))
            
    conn.commit()
    
    cur.close()
    conn.close()
    

    return {"task_id": task_id}

# edit task with changes given
@router.put("/edit_task")
async def edit_task(
    edit: Edit_Task, token: str = Depends(oauth2_scheme)
):  
    verify_token(token)
    request = []
    task_id = edit.task_id
    assignees = edit.assignees
    
    args = []
    
    if edit.progress is not None:
        request.append(('progress', edit.progress))  
    if edit.title is not None:
        request.append(('title', edit.title)) 
    if edit.description is not None:
        request.append(('description', edit.description))
    if edit.deadline is not None:
        request.append(('deadline', edit.deadline))
    
    # if no change is made
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

# return the task list based on the page type
@router.get("/tasks")
def get_tasks(page: str , profile_id: Union[int, None] = None, token: str = Depends(oauth2_scheme)):
    user_id = verify_token(token)
    conn = get_db_conn()
    cur = conn.cursor()
    
    if profile_id is not None:
        user_id = int(profile_id)
    
    select_task_list = None

    # include only the assined task for profile
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
    
    # include the assined task or created task for dashboard
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
        assignees = [User_profile(u_id=item[0], email=item[1], first_name=item[2], last_name=item[3], image=item[4]) for item in cur.fetchall()]
        task["assignees"] = assignees

    # Convert back to a list
    tasks = list(tasks_dict.values())
    cur.close()
    conn.close()

    return tasks

# delete task with given task id
@router.delete("/task")
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


@router.get("/task_estimation")
async def task_estimation(title: str, desc : Union[str, None], token: str = Depends(oauth2_scheme)):
    return oracle.get_task_estimate(title, desc)

import re, os
import urllib.request
import threading
from llama_cpp import Llama

class Estimator:

    def __init__(self, model_path):
        self.model_path = model_path
        self.llm = None
        self.download_thread = None
        if not os.path.exists(self.model_path):
            os.makedirs(os.path.join(os.getcwd(), "models"), exist_ok=True)
            download_url = "https://huggingface.co/localmodels/Vicuna-7B-v1.3-ggml/resolve/main/vicuna-7b-v1.3.ggmlv3.q2_K.bin"
            print(f"Downloading model from: {download_url}")
            self.download_thread = threading.Thread(target=self.download_model, args=(download_url, self.model_path))
            self.download_thread.start()
            urllib.request.urlretrieve(download_url, self.model_path)

    def download_model(self, url, path_to_save):
        urllib.request.urlretrieve(url, path_to_save)
        print(f"Model downloaded at: {path_to_save}")

    def initialise_llm(self):
        if self.llm == None:
            try:
                if self.download_thread == None or not self.download_thread.is_alive():
                    self.llm = Llama(model_path=self.model_path,n_ctx=512, n_batch=126)
                    return True
            except Exception as e:
                print(f"FAILED TO LOAD LLM {e}")
                self.llm = None
                return False
        else:
            return True

    def extract_mean_std(self, text):
        regex_black_magic = [
        r"(?P<mean>\d+(?:\.\d+)?)\s+mins?.*?(?P<stddev>\d+(?:\.\d+)?)\s+-\s+\d+(?:\.\d+)?\s+min",
        r"(?P<mean>\d+(?:\.\d+)?)\s+minutes.*?range.*?(?P<stddev>\d+(?:\.\d+)?)\s+-\s+\d+(?:\.\d+)?\s+minutes",
        r"(?P<mean>\d+(?:\.\d+)?)\s+minutes.*?standard deviation.*?(?P<stddev>\d+(?:\.\d+)?)\s+minutes",
        r"(?P<mean>\d+(?:\.\d+)?)\s+minutes\s+\(±(?P<stddev>\d+(?:\.\d+)?)\s+minute",
        r"mean\s+of\s+(?P<mean>\d+(?:\.\d+)?)\s+minutes?.*?standard deviation\s+of\s+(?P<stddev>\d+(?:\.\d+)?)",
        r"(?P<mean>\d+(?:\.\d+)?)\s+mins?.*?stddev\s+of\s+(?P<stddev>\d+(?:\.\d+)?)",
        r"(?P<mean>\d+(?:\.\d+)?)\s+minutes?\s+and\s+a\s+std\.?\s+dev\.?\s+of\s+(?P<stddev>\d+(?:\.\d+)?)",
        r'(?P<mean>\d+(?:\.\d+)?).*?(?P<stddev>\d+(?:\.\d+)?)'
    ]
        for pattern in regex_black_magic:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                mean = float(match.group('mean'))
                stddev = float(match.group('stddev'))
                return mean, stddev
        return 30, 5


    def get_task_estimate(self, title, desc):
        if not self.initialise_llm():
            return {"mean": 30, "std_dev": 5}        

        input_string = f"Q: I am attempting the task titled '{title}'"
        if desc != None:
            input_string += f", which has a description '{desc}'" 
        input_string += ". I want an idea how long this will take to complete. In minutes, what is the estimated mean time to complete and the estimated standard deviation time to complete? A: "

        output = self.llm(input_string, max_tokens=32, stop=["Q:", "\n"], echo=True)
        output_text = output['choices'][0]['text'].strip()
        print(output_text)
        mean, std_dev = self.extract_mean_std(output_text)
        print(f"Mean {mean}, Std_dev {std_dev}")
        return {"mean": mean, "std_dev" : std_dev}


oracle = Estimator(os.path.join(os.getcwd(), "models", "vicuna-7b-v1.3.ggmlv3.q2_K.bin"))