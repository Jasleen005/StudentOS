import sqlite3

DATABASE_NAME = "studentos.db"


def get_db_connection():
    connection = sqlite3.connect(DATABASE_NAME)
    connection.row_factory = sqlite3.Row
    return connection


def create_tables():
    connection = get_db_connection()

    # -----------------------------
    # Tasks Table
    # -----------------------------
    connection.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            subject TEXT NOT NULL,
            deadline TEXT NOT NULL,
            priority TEXT NOT NULL,
            completed INTEGER DEFAULT 0
        )
    """)

    # -----------------------------
    # Subjects Table
    # -----------------------------
    connection.execute("""
        CREATE TABLE IF NOT EXISTS subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            teacher TEXT NOT NULL,
            semester TEXT NOT NULL,
            color TEXT NOT NULL,
            icon TEXT NOT NULL
        )
    """)

       # -----------------------------
    # Study Sessions Table
    # -----------------------------
    connection.execute("""
        CREATE TABLE IF NOT EXISTS study_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject_id INTEGER NOT NULL,
            session_date TEXT NOT NULL,
            start_time TEXT NOT NULL,
            end_time TEXT NOT NULL,
            duration_minutes INTEGER NOT NULL,
            notes TEXT,
            FOREIGN KEY(subject_id) REFERENCES subjects(id)
        )
    """)

    # -----------------------------
    # Notes Table
    # -----------------------------
    connection.execute("""
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY(subject_id) REFERENCES subjects(id)
        )
    """)

    connection.commit()
    connection.close()