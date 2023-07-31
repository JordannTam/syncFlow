import numpy as np
from datetime import datetime, date, timedelta
from pydantic import BaseModel
from fastapi import APIRouter, Depends
from typing import List, Optional, Union
from utility import oauth2_scheme, get_db_conn, verify_token


router = APIRouter()

from routers.tasks import Task

class ScheduleRequest(BaseModel):
    tasks: List[Task]
    removedTasks: List[int]
    dailyTime: int
    shortest_possible: Optional[bool] = False

@router.get("/schedule")
async def create_schedule(reschedule: bool = True,
                          removedTasks: List[Task] = [],
                          time: float = None,
                          shortestPossible: bool = False,
                          token: str = Depends(oauth2_scheme)):
    id = verify_token(token)
    print(removedTasks, time, shortestPossible)

    select_task_list = """
        SELECT tasks.id, tasks.title, tasks.deadline, tasks.progress, tasks.mean, tasks.stddev
        FROM tasks               
            JOIN task_assignees ON tasks.id = task_assignees.task_id
            JOIN profiles ON task_assignees.profile_id = profiles.id
        WHERE profiles.id = %s
        ORDER BY tasks.deadline, tasks.mean;
        """

    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute(select_task_list, (id,))
    tasks = cur.fetchall()
    cur.close()
    conn.close()
    column_names = [desc[0] for desc in cur.description]
    tasks_dict = {task[0]: dict(zip(column_names, task)) for task in tasks}
    print(tasks)
    tasks = list(tasks_dict.values())
    print(f"Generating Schedule, given time {time} minutes, shortestPossible : {shortestPossible}, and tasks not available to do today {removedTasks}...")
    ts = TaskScheduler(tasks)
    schedule,time,failure = ts.get_schedule(reschedule, shortestPossible, time)
    print("Schedule Complete...")
    today = datetime.now().date().strftime('%Y-%m-%d')
    dailies = [{k: v for k, v in task.items() if k in ['title', 'deadline', 'task_id']} for task in schedule[today]]
    return {"daily_tasks": dailies, "schedule": schedule, "time": time, "failure": failure}


# Shortest list of assigned tasks
# such that if I complete that much work everyday, 
# I will meet the deadlines of all assigned tasks,


# Not Started', 'Blocked', 'Completed', 'In Progress'

progress_map = {
    'Not Started' : 1, "Blocked": 0, 'Completed' : 0, 'In Progress': 0.5
}

class TaskEntity:
    def __init__(self, id, title, progress='Not Started', deadline=None, mean = 40, stddev = 10):
        self.id = id
        self.progress = progress_map[progress]
        self.title = title
        self.mean = mean if mean != None else 40
        self.stddev = stddev if stddev != None else 10
        # self.deadline = datetime.strptime(deadline, '%Y-%m-%d') if deadline != None else None
        self.deadline = deadline

    def sample_duration(self):
        return np.random.normal(self.mean, self.stddev)*self.progress

    def __repr__(self):
        return f"TASK: {self.title}, DUE: {self.deadline}, MEAN: {self.mean}, STDDEV: {self.stddev}"
    
    def get_deadline(self):
        return self.deadline.strftime('%Y-%m-%d') if self.deadline != None else ""

    def to_dict(self):
        return {
            'task_id': self.id,
            # 'progress': self.progress,
            'title': self.title,
            'mean': self.mean,
            'stddev': self.stddev,
            'deadline': self.deadline
        }


class TaskScheduler:

    def __init__(self, tasks):
        self.tasks = sorted([TaskEntity(**t) for t in tasks], key=lambda task: (task.deadline is None, task.deadline))
        self.schedule = None

    def run_simulation(self, simulation_length=1000, days=1, success_threshold=0.95):

        low, high = 15, 840
        while low <= high:
            mid = (low + high) // 2
            successes = 0
            for _ in range(simulation_length):
                successes += self.simulation_tick(mid)

            success_rate = successes / simulation_length
            self.dprint(f"Allowed Time: {mid/60} Hours, Success rate: {success_rate*100}%")

            if success_rate >= success_threshold: 
                high = mid - 1
            else:
                low = mid + 1
        self.dprint(f"BEST TIME {mid/60} : success rate {success_rate*100}")
        return mid



    def dprint(self, text, wait=False):
        # print(text)
        if wait:
            input()

    def greedy_schedule(self, allowed_time):
        completed = 0        
        schedule = [[]]
        time = allowed_time
        insufficient_time = False
        # self.dprint(f"NEW DAY {(datetime.now() + timedelta(days=len(schedule)-1)).date()}")
        while completed < len(self.tasks):
            task = self.tasks[completed]
            if task.deadline != None and task.deadline < (datetime.now() + timedelta(days=len(schedule)-1)).date():
                # print(f"FAILURE TO COMPLETE ALL TASKS {task.deadline} and today {(datetime.now() + timedelta(days=len(schedule)-1)).date()}")
                insufficient_time = True
                # return 0
            sampled_time = task.mean
            if sampled_time > allowed_time:
                time = 0
            else:
                time -= sampled_time
            if time < 0:
                schedule.append([])
                time = allowed_time
                self.dprint(f"NEW DAY {(datetime.now() + timedelta(days=len(schedule)-1)).date()}")
            else:
                schedule[-1].append(task)
                completed += 1
            print(completed)
        
        # for i, day in enumerate(schedule):
        #     self.dprint(f"{(datetime.now() + timedelta(days=i)).date()}")
        #     self.dprint(day)
        # input()
        
        return (schedule, insufficient_time)

    def simulation_tick(self, allowed_time):
        completed = 0        
        schedule = [[]]
        time = allowed_time
        self.dprint(f"NEW DAY {(datetime.now() + timedelta(days=len(schedule)-1)).date()}")
        while completed < len(self.tasks):
            task = self.tasks[completed]
            # self.dprint(task)
            if task.deadline != None and task.deadline < (datetime.now() + timedelta(days=len(schedule)-1)).date():
                self.dprint(f"FAILURE TO COMPLETE ALL TASKS {task.deadline} and today {(datetime.now() + timedelta(days=len(schedule)-1)).date()}")
                return 0
            sampled_time = task.sample_duration()
            if sampled_time > allowed_time:
                time = 0
            else:
                time -= sampled_time
            if time < 0:
                schedule.append([])
                time = allowed_time
                # self.dprint(f"NEW DAY {(datetime.now() + timedelta(days=len(schedule)-1)).date()}")
            else:
                schedule[-1].append(task)
                completed += 1
        
        # for i, day in enumerate(schedule):
        #     self.dprint(f"{(datetime.now() + timedelta(days=i)).date()}")
        #     self.dprint(day)
        # input()
        return 1
    

    def get_schedule(self, reschedule=True, shortest_possible=False, allowed_time=8*60):
        if reschedule == True or self.schedule == None or self.schedule["date_created"] != datetime.now().date():
            return self.generate_schedule(shortest_possible, allowed_time)            
        else:
            return (self.schedule["data"], self.schedule["allowed_time"], self.schedule["failure"])

    def generate_schedule(self, shortest_possible, allowed_time):
        if shortest_possible:
            allowed_time = self.run_simulation(simulation_length=1000)
        schedule, failure = self.greedy_schedule(allowed_time)
        schedule = [[task.to_dict() for task in day_list] for day_list in schedule]
        # print(len(schedule))
        schedule_dict = {(datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d'): day_list for i, day_list in enumerate(schedule)}
        # print(schedule_dict)
        self.schedule = {"date_created": datetime.now().date(), "data": schedule_dict, "allowed_time": allowed_time, "failure": failure}
        return (schedule_dict, allowed_time, failure)
