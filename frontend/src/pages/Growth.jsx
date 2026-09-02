import { useEffect, useRef, useState } from "react";

function Growth() {

  // ==========================
  // STATE
  // ==========================

  const DAILY_GOAL = 6;

  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [streak, setStreak] = useState(0);
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState("");

  const [seconds, setSeconds] = useState(0);
  

  const [isRunning, setIsRunning] = useState(false);

  const [startTime, setStartTime] = useState(null);

  const timerRef = useRef(null);

  // ==========================
  // LOAD DATA
  // ==========================

    useEffect(() => {

  loadSubjects();
  loadSessions();
  loadStreak();
  loadWeeklyHours();

}, []);
const loadStreak = async () => {

  try {

    const response = await fetch(
      "http://127.0.0.1:8001/growth/streak"
    );

    const data = await response.json();

    setStreak(data.current_streak);

  } catch (error) {

    console.log(error);

  }

};
const loadWeeklyHours = async () => {

  try {

    const response = await fetch(
      "http://127.0.0.1:8001/growth/weekly-hours"
    );

    const data = await response.json();

    setWeeklyHours(data.hours);

  } catch (error) {

    console.log(error);

  }

};

  // ==========================
  // TIMER
  // ==========================

  useEffect(() => {

  if (!isRunning) return;

  timerRef.current = setInterval(() => {

    setSeconds((prev) => prev + 1);

  }, 1000);

  return () => {

    clearInterval(timerRef.current);

  };

}, [isRunning]);

  // ==========================
  // LOAD SUBJECTS
  // ==========================

  const loadSubjects = async () => {

    try {

      const response = await fetch(
        "http://127.0.0.1:8001/subjects"
      );

      const data = await response.json();

      setSubjects(data);

      if (data.length > 0) {

        setSelectedSubject(data[0].id);

      }

    } catch (error) {

      console.log(error);

    }

  };

  // ==========================
  // LOAD STUDY SESSIONS
  // ==========================

  const loadSessions = async () => {

    try {

      const response = await fetch(
        "http://127.0.0.1:8001/study-sessions"
      );

      const data = await response.json();

      setSessions(data);

    } catch (error) {

      console.log(error);

    }

  };

  // ==========================
  // START
  // ==========================
  const startTimer = () => {

  if (selectedSubject === "") {
    alert("Please select a subject.");
    return;
  }

  if (!startTime) {
    setStartTime(new Date());
  }

  if (!isRunning) {
    setIsRunning(true);
  }

};

  // ==========================
  // PAUSE
  // ==========================

  const pauseTimer = () => {

  clearInterval(timerRef.current);

  setIsRunning(false);

};

  // ==========================
  // RESET
  // ==========================
    const resetTimer = () => {

  clearInterval(timerRef.current);

  setIsRunning(false);

  setSeconds(0);

  setStartTime(null);

};

const saveStudySession = async () => {

  if (!startTime || seconds === 0) {
    resetTimer();
    return;
  }

  const endTime = new Date();

  const session = {
    subject_id: Number(selectedSubject),
    session_date: startTime.toISOString().split("T")[0],
    start_time: startTime.toLocaleTimeString(),
    end_time: endTime.toLocaleTimeString(),
    duration_minutes: Math.max(1, Math.floor(seconds / 60)),
    notes: ""
  };

  try {

    await fetch("http://127.0.0.1:8001/study-sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(session)
    });

    await loadSessions();

await loadStreak();

await loadWeeklyHours();

resetTimer();

    resetTimer();

  } catch (error) {

    console.log(error);

    alert("Failed to save study session.");

  }

};

  // ==========================
  // FORMAT TIME
  // ==========================

  const formatTime = () => {

    return new Date(
      seconds * 1000
    )
      .toISOString()
      .substring(11, 19);

  };

  // ==========================
  // TOTAL HOURS TODAY
  // ==========================

  const todayMinutes = sessions.reduce(

    (total, session) => total + session.duration_minutes,

    0

  );

  const todayHours = (
    todayMinutes / 60
  ).toFixed(1);

  const progress = Math.min(
    (todayHours / DAILY_GOAL) * 100,
    100
  );

  return (

    <main className="main-content">

      {/* Header */}
      <div className="dashboard-header">
        <h1>📈 Growth</h1>
        <p>Track your learning journey.</p>
      </div>

     {/* Top Statistics */}

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "30px"
  }}
>

  {/* Study Streak */}
  <div className="stat-card">

    <h2>🔥 Study Streak</h2>

    <h3>{streak} Day{streak !== 1 ? "s" : ""}</h3>

    <p>Keep studying every day!</p>

  </div>

  {/* Daily Goal */}
  <div className="stat-card">

    <h2>🎯 Daily Goal</h2>

    <h3>{todayHours} / {DAILY_GOAL} Hours</h3>

    <div
      style={{
        width: "100%",
        height: "14px",
        background: "#e5e7eb",
        borderRadius: "10px",
        overflow: "hidden",
        marginTop: "15px"
      }}
    >

      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          background: "#8B5CF6",
          transition: "0.4s"
        }}
      ></div>

    </div>

  </div>

  {/* Weekly Hours */}
  <div className="stat-card">

    <h2>📅 Weekly Hours</h2>

    <h3>{weeklyHours} Hours</h3>

    <p>This week's study time</p>

  </div>

</div>

      <br />

      {/* Focus Session */}

      <div className="dashboard-section">

        <h2>🎯 Focus Session</h2>

        <br />

        <select
          value={selectedSubject}
          onChange={(e) =>
            setSelectedSubject(e.target.value)
          }
        >

          {subjects.map((subject) => (

            <option
              key={subject.id}
              value={subject.id}
            >

              {subject.icon} {subject.name}

            </option>

          ))}

        </select>

        <br />
        <br />

        <h1
          style={{
            fontSize: "60px",
            textAlign: "center",
            letterSpacing: "3px"
          }}
        >

          {formatTime()}

        </h1>

        <br />

        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center"
          }}
        >

          <button
            className="save-task-button"
            onClick={startTimer}
          >

            ▶ Start

          </button>

          <button
            className="save-task-button"
            onClick={pauseTimer}
          >

            ⏸ Pause

          </button>

          <button
  className="delete-button"
  onClick={saveStudySession}
>
  ■ End
</button>

        </div>

      </div>

      <br />

           {/* Session History */}

      <div className="dashboard-section">

        <h2>Today's Sessions</h2>

        <br />

        {sessions.length === 0 ? (

          <p>No study sessions yet.</p>

        ) : (

          sessions.map((session) => (

            <div
              key={session.id}
              className="plan-item"
            >

              <div>

                <strong>📘 {session.subject_name}</strong>

                <p style={{ marginTop: "5px" }}>
                  📅 {session.session_date}
                </p>

                <p>
                  ⏰ {session.start_time} - {session.end_time}
                </p>

              </div>

              <div>

                <strong>
                  🕒 {session.duration_minutes} min
                </strong>

              </div>

            </div>

          ))

        )}

      </div>

    </main>

  );

}

export default Growth;