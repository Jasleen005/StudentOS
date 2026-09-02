from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from database import create_tables, get_db_connection
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

create_tables()


class Task(BaseModel):
    title: str
    subject: str
    deadline: str
    priority: str
    completed: bool = False


class Subject(BaseModel):
    name: str
    teacher: str
    semester: str
    color: str
    icon: str

class StudySession(BaseModel):
    subject_id: int
    session_date: str
    start_time: str
    end_time: str
    duration_minutes: int
    notes: str = ""

class Note(BaseModel):
    subject_id: int
    title: str
    content: str
    created_at: str

@app.get("/")
def home():
    return {"message": "StudentOS API is running"}


# -------------------------
# GET ALL TASKS
# -------------------------
@app.get("/tasks")
def get_tasks():
    connection = get_db_connection()

    tasks = connection.execute(
        "SELECT * FROM tasks ORDER BY id DESC"
    ).fetchall()

    connection.close()

    return [dict(task) for task in tasks]


# -------------------------
# ADD TASK
# -------------------------
@app.post("/tasks")
def add_task(task: Task):
    connection = get_db_connection()

    cursor = connection.execute(
        """
        INSERT INTO tasks(title, subject, deadline, priority, completed)
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            task.title,
            task.subject,
            task.deadline,
            task.priority,
            int(task.completed)
        )
    )

    connection.commit()

    task_id = cursor.lastrowid

    new_task = connection.execute(
        "SELECT * FROM tasks WHERE id = ?",
        (task_id,)
    ).fetchone()

    connection.close()

    return dict(new_task)


# -------------------------
# COMPLETE / UNDO TASK
# -------------------------
@app.put("/tasks/{task_id}")
def toggle_task(task_id: int):

    connection = get_db_connection()

    task = connection.execute(
        "SELECT * FROM tasks WHERE id=?",
        (task_id,)
    ).fetchone()

    if task is None:
        connection.close()
        raise HTTPException(status_code=404, detail="Task not found")

    new_status = 0 if task["completed"] else 1

    connection.execute(
        """
        UPDATE tasks
        SET completed = ?
        WHERE id = ?
        """,
        (new_status, task_id)
    )

    connection.commit()

    updated_task = connection.execute(
        "SELECT * FROM tasks WHERE id=?",
        (task_id,)
    ).fetchone()

    connection.close()

    return dict(updated_task)


# -------------------------
# DELETE TASK
# -------------------------
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):

    connection = get_db_connection()

    task = connection.execute(
        "SELECT * FROM tasks WHERE id=?",
        (task_id,)
    ).fetchone()

    if task is None:
        connection.close()
        raise HTTPException(status_code=404, detail="Task not found")

    connection.execute(
        "DELETE FROM tasks WHERE id=?",
        (task_id,)
    )

    connection.commit()
    connection.close()

    return {"message": "Task deleted successfully"}


# -------------------------
# DASHBOARD STATS
# -------------------------
@app.get("/dashboard")
def dashboard():

    connection = get_db_connection()

    total = connection.execute(
        "SELECT COUNT(*) FROM tasks"
    ).fetchone()[0]

    completed = connection.execute(
        "SELECT COUNT(*) FROM tasks WHERE completed=1"
    ).fetchone()[0]

    pending = connection.execute(
        "SELECT COUNT(*) FROM tasks WHERE completed=0"
    ).fetchone()[0]

    high = connection.execute(
        "SELECT COUNT(*) FROM tasks WHERE priority='High'"
    ).fetchone()[0]

    connection.close()

    completion_rate = 0

    if total > 0:
        completion_rate = round((completed / total) * 100, 1)

    return {
        "total_tasks": total,
        "completed_tasks": completed,
        "pending_tasks": pending,
        "high_priority": high,
        "completion_rate": completion_rate,
    }

# -------------------------
# GET ALL SUBJECTS
# -------------------------
@app.get("/subjects")
def get_subjects():

    connection = get_db_connection()

    subjects = connection.execute(
        "SELECT * FROM subjects ORDER BY id DESC"
    ).fetchall()

    connection.close()

    return [dict(subject) for subject in subjects]

# -------------------------
# ADD SUBJECT
# -------------------------
@app.post("/subjects")
def add_subject(subject: Subject):

    connection = get_db_connection()

    cursor = connection.execute(
        """
        INSERT INTO subjects(name, teacher, semester, color, icon)
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            subject.name,
            subject.teacher,
            subject.semester,
            subject.color,
            subject.icon
        )
    )

    connection.commit()

    subject_id = cursor.lastrowid

    new_subject = connection.execute(
        "SELECT * FROM subjects WHERE id=?",
        (subject_id,)
    ).fetchone()

    connection.close()

    return dict(new_subject)

# -------------------------
# UPDATE SUBJECT
# -------------------------
@app.put("/subjects/{subject_id}")
def update_subject(subject_id: int, subject: Subject):

    connection = get_db_connection()

    connection.execute(
        """
        UPDATE subjects
        SET
            name=?,
            teacher=?,
            semester=?,
            color=?,
            icon=?
        WHERE id=?
        """,
        (
            subject.name,
            subject.teacher,
            subject.semester,
            subject.color,
            subject.icon,
            subject_id
        )
    )

    connection.commit()

    updated = connection.execute(
        "SELECT * FROM subjects WHERE id=?",
        (subject_id,)
    ).fetchone()

    connection.close()

    return dict(updated)


# -------------------------
# DELETE SUBJECT
# -------------------------
@app.delete("/subjects/{subject_id}")
def delete_subject(subject_id: int):

    connection = get_db_connection()

    connection.execute(
        "DELETE FROM subjects WHERE id=?",
        (subject_id,)
    )

    connection.commit()
    connection.close()

    return {"message": "Subject deleted successfully"}

# -------------------------
# GET STUDY SESSIONS
# -------------------------
@app.get("/study-sessions")
def get_study_sessions():

    connection = get_db_connection()

    sessions = connection.execute(
        """
        SELECT
            study_sessions.*,
            subjects.name AS subject_name
        FROM study_sessions
        JOIN subjects
        ON study_sessions.subject_id = subjects.id
        ORDER BY study_sessions.id DESC
        """
    ).fetchall()

    connection.close()

    return [dict(session) for session in sessions]



# -------------------------
# ADD STUDY SESSION
# -------------------------
@app.post("/study-sessions")
def add_study_session(session: StudySession):

    connection = get_db_connection()

    cursor = connection.execute(
        """
        INSERT INTO study_sessions(
            subject_id,
            session_date,
            start_time,
            end_time,
            duration_minutes,
            notes
        )
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            session.subject_id,
            session.session_date,
            session.start_time,
            session.end_time,
            session.duration_minutes,
            session.notes
        )
    )

    connection.commit()

    session_id = cursor.lastrowid

    new_session = connection.execute(
        "SELECT * FROM study_sessions WHERE id=?",
        (session_id,)
    ).fetchone()

    connection.close()

    return dict(new_session)


# -------------------------
# DELETE STUDY SESSION
# -------------------------
@app.delete("/study-sessions/{session_id}")
def delete_study_session(session_id: int):

    connection = get_db_connection()

    connection.execute(
        "DELETE FROM study_sessions WHERE id=?",
        (session_id,)
    )

    connection.commit()

    connection.close()

    return {
        "message": "Study session deleted successfully"
    }

# -------------------------
# GET NOTES FOR SUBJECT
# -------------------------
@app.get("/notes/{subject_id}")
def get_notes(subject_id: int):

    connection = get_db_connection()

    notes = connection.execute(
        """
        SELECT *
        FROM notes
        WHERE subject_id = ?
        ORDER BY id DESC
        """,
        (subject_id,)
    ).fetchall()

    connection.close()

    return [dict(note) for note in notes]

# -------------------------
# ADD NOTE
# -------------------------
@app.post("/notes")
def add_note(note: Note):

    connection = get_db_connection()

    cursor = connection.execute(
        """
        INSERT INTO notes(
            subject_id,
            title,
            content,
            created_at
        )
        VALUES (?, ?, ?, ?)
        """,
        (
            note.subject_id,
            note.title,
            note.content,
            note.created_at
        )
    )

    connection.commit()

    note_id = cursor.lastrowid

    new_note = connection.execute(
        "SELECT * FROM notes WHERE id=?",
        (note_id,)
    ).fetchone()

    connection.close()

    return dict(new_note)

# -------------------------
# STUDY STREAK
# -------------------------
@app.get("/growth/streak")
def get_streak():

    connection = get_db_connection()

    dates = connection.execute(
        """
        SELECT DISTINCT session_date
        FROM study_sessions
        ORDER BY session_date DESC
        """
    ).fetchall()

    connection.close()

    if not dates:
        return {
            "current_streak": 0
        }

    from datetime import datetime

    study_dates = [
        datetime.strptime(
            row["session_date"],
            "%Y-%m-%d"
        ).date()
        for row in dates
    ]

    streak = 1

    for i in range(len(study_dates) - 1):

        difference = (
            study_dates[i] -
            study_dates[i + 1]
        ).days

        if difference == 1:
            streak += 1
        else:
            break

    return {
        "current_streak": streak
    }

# -------------------------
# WEEKLY STUDY HOURS
# -------------------------
@app.get("/growth/weekly-hours")
def get_weekly_hours():

    from datetime import datetime, timedelta

    connection = get_db_connection()

    today = datetime.today().date()
    week_start = today - timedelta(days=today.weekday())

    result = connection.execute(
        """
        SELECT SUM(duration_minutes) AS total
        FROM study_sessions
        WHERE session_date >= ?
        """,
        (week_start.strftime("%Y-%m-%d"),)
    ).fetchone()

    connection.close()

    total_minutes = result["total"] if result["total"] else 0

    return {
        "hours": round(total_minutes / 60, 1)
    }


# -------------------------
# GET NOTES BY SUBJECT
# -------------------------
@app.get("/notes/{subject_id}")
def get_notes(subject_id: int):

    connection = get_db_connection()

    notes = connection.execute(
        """
        SELECT *
        FROM notes
        WHERE subject_id = ?
        ORDER BY id DESC
        """,
        (subject_id,)
    ).fetchall()

    connection.close()

    return [dict(note) for note in notes]


# -------------------------
# ADD NOTE
# -------------------------
@app.post("/notes")
def add_note(note: Note):

    connection = get_db_connection()

    cursor = connection.execute(
        """
        INSERT INTO notes(
            subject_id,
            title,
            content,
            created_at
        )
        VALUES (?, ?, ?, ?)
        """,
        (
            note.subject_id,
            note.title,
            note.content,
            note.created_at
        )
    )

    connection.commit()

    note_id = cursor.lastrowid

    new_note = connection.execute(
        "SELECT * FROM notes WHERE id=?",
        (note_id,)
    ).fetchone()

    connection.close()

    return dict(new_note)


# -------------------------
# UPDATE NOTE
# -------------------------
@app.put("/notes/{note_id}")
def update_note(note_id: int, note: Note):

    connection = get_db_connection()

    connection.execute(
        """
        UPDATE notes
        SET
            title = ?,
            content = ?,
            created_at = ?
        WHERE id = ?
        """,
        (
            note.title,
            note.content,
            note.created_at,
            note_id
        )
    )

    connection.commit()

    updated_note = connection.execute(
        "SELECT * FROM notes WHERE id=?",
        (note_id,)
    ).fetchone()

    connection.close()

    return dict(updated_note)


# -------------------------
# DELETE NOTE
# -------------------------
@app.delete("/notes/{note_id}")
def delete_note(note_id: int):

    connection = get_db_connection()

    connection.execute(
        "DELETE FROM notes WHERE id=?",
        (note_id,)
    )

    connection.commit()

    connection.close()

    return {
        "message": "Note deleted successfully"
    }