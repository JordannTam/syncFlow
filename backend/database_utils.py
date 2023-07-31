import argparse, random
from datetime import datetime, date, timedelta
from utility import get_db_conn


def generate_sample_data_user1_tasks(tasks_per_day):
    conn = get_db_conn()
    cur = conn.cursor()
    user_id=1
    cur.execute(f"DELETE FROM task_assignees WHERE profile_id = {user_id}")
    conn.commit()

    # tasks_per_day = 6

    start_date = datetime.now()
    end_date = start_date + timedelta(weeks=4)
    num_days = (end_date - start_date).days
    # sample_tasks = []
    for day in range(num_days):
        for i in range(tasks_per_day):  # 6 tasks per day
            deadline = (start_date + timedelta(days=day)).date()
            mean = random.randint(15, 120)
            stddev = random.randint(5, 45)
            task = {
                # 'id' : f'{day * 6 + i + 1}',
                'creator_id': user_id, 
                'title': f'Task {day * 6 + i + 1}',
                # 'deadline': deadline.strftime('%Y-%m-%d'),
                'deadline': deadline,
                'mean': mean,
                'stddev': stddev
            }

            cur.execute("""
                INSERT INTO tasks (creator_id, title, deadline, initial_date, progress, mean, stddev)
                VALUES (%s, %s, %s, CURRENT_DATE, 'Not Started', %s, %s) RETURNING id;
                """, (task['creator_id'], task['title'], task['deadline'], task['mean'], task['stddev']))

            task_id = cur.fetchone()[0]
           
            cur.execute("""
                INSERT INTO task_assignees (task_id, profile_id)
                VALUES (%s, %s);
                """, (task_id, user_id))
            # sample_tasks.append(task)
    # sample_tasks.append({'id':'5000', 'title':'NULL_TEST'})

    # VERY LONG TITLE
    task = {
        'creator_id': user_id, 
        'title': 'TESTING HAVE A TASK WITH A VERY LONG TITLE NAME' + 'TEST '*25,
        'deadline': (start_date + timedelta(days=100)).date(),
        'mean': 30,
        'stddev': 15
    }

    cur.execute("""
        INSERT INTO tasks (creator_id, title, deadline, initial_date, progress, mean, stddev)
        VALUES (%s, %s, %s, CURRENT_DATE, 'Not Started', %s, %s) RETURNING id;
        """, (task['creator_id'], task['title'], task['deadline'], task['mean'], task['stddev']))

    task_id = cur.fetchone()[0]
    
    cur.execute("""
        INSERT INTO task_assignees (task_id, profile_id)
        VALUES (%s, %s);
        """, (task_id, user_id))

    # No deadline
    task = {'creator_id': user_id,
            'title': 'TEST NO DEADLINE',
            'mean': 30,
            'stddev': 15
    }
    cur.execute("""
                INSERT INTO tasks (creator_id, title, initial_date, progress, mean, stddev)
                VALUES (%s, %s, CURRENT_DATE, 'Not Started', %s, %s) RETURNING id;
                """, (task['creator_id'], task['title'], task['mean'], task['stddev']))
    task_id = cur.fetchone()[0]
    cur.execute("""
        INSERT INTO task_assignees (task_id, profile_id)
        VALUES (%s, %s);
        """, (task_id, user_id))
    

    # No mean, stddev
    task = {'creator_id': user_id,
            'title': 'TEST NO TIME VARIABLES',
            'deadline': (start_date + timedelta(days=100)).date(),}
    cur.execute("""
                INSERT INTO tasks (creator_id, title, deadline, initial_date, progress)
                VALUES (%s, %s, %s, CURRENT_DATE, 'Not Started') RETURNING id;
                """, (task['creator_id'], task['title'], task['deadline']))
    task_id = cur.fetchone()[0]
    cur.execute("""
        INSERT INTO task_assignees (task_id, profile_id)
        VALUES (%s, %s);
        """, (task_id, user_id))

    conn.commit()
    cur.close()
    conn.close()


def remake_database():
    print("Recreating Database...")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="create sample data for endgames' task management app")
    parser.add_argument('-r', '--remake-database', help="Remake Database") # TODO
    parser.add_argument('-t', '--task-create', type=int,default=6, help="Takes a profile ID and creates a bunch of tasks from current day to 3 weeks onwards")

    args = parser.parse_args()
    if args.task_create:
        generate_sample_data_user1_tasks(args.task_create)
    if args.remake_database:
        remake_database()



    # TODO