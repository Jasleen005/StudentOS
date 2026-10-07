import { useEffect, useState } from "react";

function StudyPlanner() {

  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [subjectId, setSubjectId] = useState("");
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");

  // -------------------------
  // LOAD SUBJECTS
  // -------------------------
  const loadSubjects = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8001/subjects"
      );

      if (!response.ok) {
        throw new Error("Failed to load subjects");
      }

      const data = await response.json();
      setSubjects(data);

    } catch (error) {
      console.log(error);
      alert("Failed to load subjects.");
    }
  };


  // -------------------------
  // LOAD STUDY SESSIONS
  // -------------------------
  const loadSessions = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8001/study-sessions"
      );

      if (!response.ok) {
        throw new Error("Failed to load study sessions");
      }

      const data = await response.json();
      setSessions(data);

    } catch (error) {
      console.log(error);
      alert("Failed to load study sessions.");
    }
  };


  // -------------------------
  // LOAD DATA ON PAGE OPEN
  // -------------------------
  useEffect(() => {
    loadSubjects();
    loadSessions();
  }, []);


  // -------------------------
  // CALCULATE END TIME
  // -------------------------
  const calculateEndTime = (startTime, durationMinutes) => {

    const [hours, minutes] = startTime
      .split(":")
      .map(Number);

    const totalMinutes =
      hours * 60 +
      minutes +
      Number(durationMinutes);

    const endHours =
      Math.floor(totalMinutes / 60) % 24;

    const endMinutes =
      totalMinutes % 60;

    return `${String(endHours).padStart(2, "0")}:${String(
      endMinutes
    ).padStart(2, "0")}`;
  };


  // -------------------------
  // ADD STUDY SESSION
  // -------------------------
  const addSession = async () => {

    if (!subjectId || !topic.trim() || !date || !time) {
      alert("Please fill all study session details.");
      return;
    }

    const durationMinutes = Number(duration);

    const endTime = calculateEndTime(
      time,
      durationMinutes
    );

    const newSession = {
      subject_id: Number(subjectId),
      session_date: date,
      start_time: time,
      end_time: endTime,
      duration_minutes: durationMinutes,
      notes: topic
    };

    try {

      const response = await fetch(
        "http://127.0.0.1:8001/study-sessions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newSession)
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add study session");
      }

      await loadSessions();

      setSubjectId("");
      setTopic("");
      setDate("");
      setTime("");
      setDuration("60");

    } catch (error) {

      console.log(error);
      alert("Failed to add study session.");

    }
  };


  // -------------------------
  // DELETE STUDY SESSION
  // -------------------------
  const deleteSession = async (sessionId) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this study session?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      const response = await fetch(
        `http://127.0.0.1:8001/study-sessions/${sessionId}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete study session");
      }

      await loadSessions();

    } catch (error) {

      console.log(error);
      alert("Failed to delete study session.");

    }
  };


  return (
    <main className="main-content">

      {/* Header */}

      <div className="workspace-header">

        <div>

          <h1>📅 Study Planner</h1>

          <p>
            Plan your study sessions and stay on track.
          </p>

        </div>

      </div>


      {/* Add Study Session */}

      <div className="workspace-card">

        <h2>➕ Plan a Study Session</h2>


        {/* Subject */}

        <select
          value={subjectId}
          onChange={(e) =>
            setSubjectId(e.target.value)
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px"
          }}
        >

          <option value="">
            Select Subject
          </option>

          {subjects.map((subject) => (

            <option
              key={subject.id}
              value={subject.id}
            >
              {subject.name}
            </option>

          ))}

        </select>


        {/* Topic */}

        <input
          type="text"
          placeholder="Topic to study"
          value={topic}
          onChange={(e) =>
            setTopic(e.target.value)
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px"
          }}
        />


        {/* Date */}

        <input
          type="date"
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
          style={{
            padding: "10px",
            marginRight: "10px"
          }}
        />


        {/* Time */}

        <input
          type="time"
          value={time}
          onChange={(e) =>
            setTime(e.target.value)
          }
          style={{
            padding: "10px",
            marginRight: "10px"
          }}
        />


        {/* Duration */}

        <select
          value={duration}
          onChange={(e) =>
            setDuration(e.target.value)
          }
          style={{
            padding: "10px",
            marginRight: "10px"
          }}
        >

          <option value="30">
            30 minutes
          </option>

          <option value="60">
            1 hour
          </option>

          <option value="120">
            2 hours
          </option>

          <option value="180">
            3 hours
          </option>

        </select>


        <button onClick={addSession}>
          Add Session
        </button>

      </div>


      {/* Planned Sessions */}

      <div style={{ marginTop: "30px" }}>

        <h2>📚 Planned Sessions</h2>


        {sessions.length === 0 ? (

          <p>
            No study sessions planned yet.
          </p>

        ) : (

          sessions.map((session) => (

            <div
              key={session.id}
              className="workspace-card"
              style={{
                marginTop: "15px"
              }}
            >

              <h3>
                {session.subject_name} —{" "}
                {session.notes}
              </h3>


              <p>
                📅 {session.session_date}
              </p>


              <p>
                🕒 {session.start_time} -{" "}
                {session.end_time}
              </p>


              <p>
                ⏱️ {session.duration_minutes} minutes
              </p>


              <button
                onClick={() =>
                  deleteSession(session.id)
                }
              >
                Delete
              </button>

            </div>

          ))

        )}

      </div>

    </main>
  );
}

export default StudyPlanner;