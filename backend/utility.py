import psycopg2

def get_db_conn():
    conn = psycopg2.connect(
        dbname="endgame",
        user="teamendgame",
        host="localhost",
        password="password"
    )
    return conn
