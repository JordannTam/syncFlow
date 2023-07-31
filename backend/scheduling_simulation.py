import matplotlib.pyplot as plt
import numpy as np
import itertools
from datetime import datetime, date, timedelta
import random

# Shortest list of assigned tasks
# such that if I complete that much work everyday, 
# I will meet the deadlines of all assigned tasks,

def generate_sample_data(tasks_per_day):
    start_date = datetime.now()
    end_date = start_date + timedelta(weeks=3)
    num_days = (end_date - start_date).days
    sample_tasks = []
    for day in range(num_days):
        for i in range(tasks_per_day):  # 6 tasks per day
            deadline = (start_date + timedelta(days=day)).date()
            mean = random.randint(15, 120)
            stddev = random.randint(5, 45)
            task = {
                'id' : f'{day * 6 + i + 1}',
                'title': f'Task {day * 6 + i + 1}',
                # 'deadline': deadline.strftime('%Y-%m-%d'),
                'deadline': deadline,
                'mean': mean,
                'stddev': stddev
            }
            sample_tasks.append(task)
    sample_tasks.append({'id':'5000', 'title':'NULL_TEST'})
    return sample_tasks

# Not Started', 'Blocked', 'Completed', 'In Progress'

progress_map = {
    'Not Started' : 1, "Blocked": 0, 'Completed' : 0, 'In Progress': 0.5
}

class Task:
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



from rich.console import Console
from rich.table import Table
from rich import print

class TaskScheduler:

    def __init__(self, tasks):
        self.tasks = sorted([Task(**t) for t in tasks], key=lambda task: (task.deadline is None, task.deadline))
        self.schedule = None

    def print_tasks(self):
        table = Table(show_header=True, header_style="bold magenta")
        table.add_column("Title")
        table.add_column("Mean")
        table.add_column("StdDev")
        table.add_column("Deadline")
        for task in self.tasks:
            table.add_row(task.title, str(task.mean), str(task.stddev), task.get_deadline())
        
        console = Console()
        return console.print(table, justify="center")


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
            time -= sampled_time 
            if time < 0:
                schedule.append([])
                time = allowed_time
                self.dprint(f"NEW DAY {(datetime.now() + timedelta(days=len(schedule)-1)).date()}")
            else:
                schedule[-1].append(task)
                completed += 1
        
        for i, day in enumerate(schedule):
            self.dprint(f"{(datetime.now() + timedelta(days=i)).date()}")
            self.dprint(day)
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
            time -= sampled_time 
            if time < 0:
                schedule.append([])
                time = allowed_time
                self.dprint(f"NEW DAY {(datetime.now() + timedelta(days=len(schedule)-1)).date()}")
            else:
                schedule[-1].append(task)
                completed += 1
        
        for i, day in enumerate(schedule):
            self.dprint(f"{(datetime.now() + timedelta(days=i)).date()}")
            self.dprint(day)
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

if __name__ == '__main__':
    for i in range(2, 16, 2):
        print(f"COMPLETING {i} TASKS")
        sample_tasks = generate_sample_data(i)
        main = TaskScheduler(sample_tasks)
        # main.print_tasks()
        time = main.run_simulation(simulation_length=1000)
        schedule = main.greedy_schedule(time)
        print(schedule)