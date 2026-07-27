import sqlite3
import os

db_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), '..', 'aayam.db')

conn = sqlite3.connect(db_path)
try:
    conn.execute("ALTER TABLE audition ADD COLUMN play_id INTEGER REFERENCES play(id);")
    print("Successfully added play_id to audition table.")
except sqlite3.OperationalError as e:
    print("Error:", e)
finally:
    conn.commit()
    conn.close()
