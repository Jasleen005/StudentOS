import { useState } from "react";

function StudyPlanner() {

  const [sessions, setSessions] = useState([
    {
      id: 1,
      subject: "Java",
      topic: "OOP Concepts",
      date: "2026-09-11",
      time: "10:00",
      duration: "2 hours"
    },
    {
      id: 2,
      subject: "DBMS",
      topic: "SQL Queries",
      date: "2026-09-12",
      time: "14:00",
      duration: "1 hour"
    }
  ]);

  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("1 hour");

  const addSession = () => {

    if (!subject.trim() || !topic.trim() || !date || !time) {
      alert("Please fill all study session details.");
      return;
    }

    const newSession = {
      id: Date.now(),
      subject,
      topic,
      date,
      time,
      duration
    };

    setSessions([...sessions, newSession]);

    setSubject("");
    setTopic("");
    setDate("");
    setTime("");
    setDuration("1 hour");
  };

  const deleteSession = (sessionId) => {
    setSessions(
      sessions.filter(
        (session) => session.id !== sessionId
      )
    );
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

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px"
          }}
        />

        <input
          type="text"
          placeholder="Topic to study"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px"
          }}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px"
          }}
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px"
          }}
        />

        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px"
          }}
        >
          <option value="30 minutes">30 minutes</option>
          <option value="1 hour">1 hour</option>
          <option value="2 hours">2 hours</option>
          <option value="3 hours">3 hours</option>
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
                {session.subject} — {session.topic}
              </h3>

              <p>
                📅 {session.date}
              </p>

              <p>
                🕒 {session.time}
              </p>

              <p>
                ⏱️ {session.duration}
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