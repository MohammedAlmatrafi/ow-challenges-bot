import os
import sqlite3

# Connect to the SQLite database
DB_PATH = os.path.join(os.path.dirname(__file__), 'challenges.db')

def initialize_database():
    """Initialize the database and create the table if it doesn't exist."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_challenges (
            server_id BIGINT NOT NULL,
            user_id BIGINT NOT NULL,
            challenges_attended INTEGER DEFAULT 0,
            challenges_won INTEGER DEFAULT 0,
            PRIMARY KEY (server_id, user_id)
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS challenges (
            challenge_id TEXT PRIMARY KEY,
            server_id TEXT NOT NULL,
            members TEXT NOT NULL   
        )
    """)
    conn.commit()
    conn.close()

initialize_database()

def get_challenge_stats(server_id, user_id):
    """Retrieve the challenge stats for a user in a specific server."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT challenges_attended, challenges_won
        FROM user_challenges
        WHERE server_id = ? AND user_id = ?
    """, (server_id, user_id))
    result = cursor.fetchone()
    conn.close()
    return result or (0, 0)  # Default to (0, 0) if no record exists

def initialize_user(server_id: int, user_id: int):
    """Initialize a user and insert them if they don't exist."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT OR IGNORE INTO user_challenges (server_id, user_id)
        VALUES (?, ?);
    """, (server_id, user_id))
    conn.commit()
    conn.close()

def db_update_user_stats(server_id:str, user_id:str, attended:int, won:int):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO user_challenges (server_id, user_id, challenges_attended, challenges_won)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(server_id, user_id) DO UPDATE SET
        challenges_attended = challenges_attended + ?,
        challenges_won = challenges_won + ?
    """, (server_id, user_id, attended, won, attended, won))
    conn.commit()
    conn.close()

def get_sorted_leaderboard(server_id, sort_by="challenges_won"):
    """Retrieve a sorted leaderboard for a specific server."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(f"""
        SELECT user_id, challenges_attended, challenges_won
        FROM user_challenges
        WHERE server_id = ?
        ORDER BY {sort_by} DESC
    """, (server_id,))
    leaderboard = cursor.fetchall()
    conn.close()
    return leaderboard

def get_user_rank(server_id, user_id, sort_by="challenges_won"):
    """Get the rank of a specific user in the leaderboard."""
    leaderboard = get_sorted_leaderboard(server_id, sort_by)
    for rank, (uid, attended, won) in enumerate(leaderboard, start=1):
        if uid == user_id:
            return rank, attended, won
    return None, 0, 0  # User not found in the leaderboard

def add_challenge_to_db(challenge_id:str, server_id:str, members:str):
    """Add a new challenge to the challenges table in the database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(f"""
        INSERT INTO challenges (challenge_id, server_id, members)
        VALUES (?, ?, ?);
    """, (challenge_id, server_id, members))
    conn.commit()
    conn.close()
    
def get_challenge(challenge_id:str):
    """Retreive challenge from the challenges table in the database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(f"""
        SELECT * FROM challenges WHERE challenge_id = ?;
    """, (challenge_id,))
    result = cursor.fetchone()
    conn.close()
    return result