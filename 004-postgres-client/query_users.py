import psycopg2
import time

time.sleep(5)

conn = psycopg2.connect(
    host="postgres-db",
    port=5432,
    database="mydb",
    user="admin",
    password="admin123"
)

cur = conn.cursor()
cur.execute("SELECT * FROM users")
rows = cur.fetchall()

print("Users in the database:")
for row in rows:
    print(row)

cur.close()
conn.close()
