import { useEffect, useState } from "react";

function Analytics() {

  const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [loading, setLoading] = useState(true);

  // -------------------------
  // LOAD ANALYTICS DATA
  // -------------------------
  const loadAnalyticsData = async () => {

    try {

      const [tasksResponse, sessionsResponse, subjectsResponse] =
        await Promise.all([
          fetch("http://127.0.0.1:8001/tasks"),
          fetch("http://127.0.0.1:8001/study-sessions"),
          fetch("http://127.0.0.1:8001/subjects")
        ]);

      if (
        !tasksResponse.ok ||
        !sessionsResponse.ok ||
        !subjectsResponse.ok
      ) {
        throw new Error("Failed to load analytics data");
      }

      const tasksData = await tasksResponse.json();
      const sessionsData = await sessionsResponse.json();
      const subjectsData = await subjectsResponse.json();

      setTasks(tasksData);
      setSessions(sessionsData);
      setSubjects(subjectsData);

    } catch (error) {

      console.log(error);
      alert("Failed to load analytics data.");

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadAnalyticsData();
  }, []);


  // -------------------------
  // BASIC STATISTICS
  // -------------------------

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks =
    totalTasks - completedTasks;

  const taskCompletionRate =
    totalTasks > 0
      ? Math.round(
          (completedTasks / totalTasks) * 100
        )
      : 0;


  const totalStudyMinutes =
    sessions.reduce(
      (total, session) =>
        total + Number(session.duration_minutes || 0),
      0
    );


  const totalStudyHours =
    (totalStudyMinutes / 60).toFixed(1);


  // -------------------------
  // WEEKLY STUDY DATA
  // -------------------------

  const getLastSevenDays = () => {

    const days = [];

    for (let i = 6; i >= 0; i--) {

      const date = new Date();

      date.setHours(0, 0, 0, 0);

      date.setDate(
        date.getDate() - i
      );

      const dateString =
        date.toISOString().split("T")[0];

      days.push({
        date: dateString,
        label: date.toLocaleDateString(
          "en-US",
          {
            weekday: "short"
          }
        ),
        minutes: 0
      });

    }

    return days;
  };


  const weeklyData = getLastSevenDays();


  sessions.forEach((session) => {

    const day = weeklyData.find(
      (item) =>
        item.date === session.session_date
    );

    if (day) {

      day.minutes += Number(
        session.duration_minutes || 0
      );

    }

  });


  const maximumDailyMinutes =
    Math.max(
      ...weeklyData.map(
        (day) => day.minutes
      ),
      60
    );


  // -------------------------
  // SUBJECT STUDY BREAKDOWN
  // -------------------------

  const subjectStudyData =
    subjects.map((subject) => {

      const minutes =
        sessions
          .filter(
            (session) =>
              session.subject_id === subject.id
          )
          .reduce(
            (total, session) =>
              total +
              Number(
                session.duration_minutes || 0
              ),
            0
          );

      return {
        ...subject,
        minutes
      };

    })
    .sort(
      (a, b) =>
        b.minutes - a.minutes
    );


  if (loading) {

    return (
      <main className="main-content">

        <h1>📊 Analytics</h1>

        <p>
          Loading your study analytics...
        </p>

      </main>
    );

  }


  return (
    <main className="main-content">

      {/* HEADER */}

      <div className="workspace-header">

        <div>

          <h1>📊 Analytics</h1>

          <p>
            Understand your study patterns
            and academic progress.
          </p>

        </div>

      </div>


      {/* SUMMARY CARDS */}

      <div
        className="workspace-grid"
        style={{
          marginTop: "25px"
        }}
      >

        <div className="workspace-card">

          <h2>⏱️ Study Time</h2>

          <h1>
            {totalStudyHours} hrs
          </h1>

          <p>
            Total recorded study time
          </p>

        </div>


        <div className="workspace-card">

          <h2>📚 Sessions</h2>

          <h1>
            {sessions.length}
          </h1>

          <p>
            Study sessions completed
          </p>

        </div>


        <div className="workspace-card">

          <h2>✅ Task Completion</h2>

          <h1>
            {taskCompletionRate}%
          </h1>

          <p>
            {completedTasks} completed /{" "}
            {pendingTasks} pending
          </p>

        </div>


        <div className="workspace-card">

          <h2>📘 Subjects</h2>

          <h1>
            {subjects.length}
          </h1>

          <p>
            Subjects being tracked
          </p>

        </div>

      </div>


      {/* WEEKLY STUDY ACTIVITY */}

      <div
        className="workspace-card"
        style={{
          marginTop: "30px"
        }}
      >

        <h2>
          📈 Study Activity — Last 7 Days
        </h2>

        <p>
          Your recorded study time for each day.
        </p>


        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "15px",
            height: "220px",
            marginTop: "30px",
            padding: "10px"
          }}
        >

          {weeklyData.map((day) => {

            const height =
              day.minutes === 0
                ? 5
                : Math.max(
                    10,
                    (day.minutes /
                      maximumDailyMinutes) *
                      160
                  );

            return (

              <div
                key={day.date}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  height: "100%"
                }}
              >

                <small>
                  {day.minutes}m
                </small>

                <div
                  style={{
                    width: "100%",
                    maxWidth: "45px",
                    height: `${height}px`,
                    background:
                      "#8B5CF6",
                    borderRadius: "8px 8px 0 0",
                    marginTop: "8px"
                  }}
                />

                <small
                  style={{
                    marginTop: "8px"
                  }}
                >
                  {day.label}
                </small>

              </div>

            );

          })}

        </div>

      </div>


      {/* SUBJECT BREAKDOWN */}

      <div
        className="workspace-card"
        style={{
          marginTop: "30px"
        }}
      >

        <h2>
          📚 Study Time by Subject
        </h2>

        <p>
          See where you're spending most of
          your study time.
        </p>


        {subjectStudyData.length === 0 ? (

          <p
            style={{
              marginTop: "20px"
            }}
          >
            No subject data available yet.
          </p>

        ) : (

          <div
            style={{
              marginTop: "20px"
            }}
          >

            {subjectStudyData.map(
              (subject) => {

                const percentage =
                  totalStudyMinutes > 0
                    ? Math.round(
                        (subject.minutes /
                          totalStudyMinutes) *
                          100
                      )
                    : 0;

                return (

                  <div
                    key={subject.id}
                    style={{
                      marginBottom: "20px"
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        marginBottom: "6px"
                      }}
                    >

                      <strong>
                        {subject.icon}{" "}
                        {subject.name}
                      </strong>

                      <span>
                        {(
                          subject.minutes /
                          60
                        ).toFixed(1)}{" "}
                        hrs
                      </span>

                    </div>


                    <div
                      style={{
                        width: "100%",
                        height: "10px",
                        background:
                          "#E5E7EB",
                        borderRadius: "10px",
                        overflow: "hidden"
                      }}
                    >

                      <div
                        style={{
                          width: `${percentage}%`,
                          height: "100%",
                          background:
                            subject.color ||
                            "#8B5CF6",
                          borderRadius:
                            "10px"
                        }}
                      />

                    </div>

                  </div>

                );

              }
            )}

          </div>

        )}

      </div>


      {/* TASK PROGRESS */}

      <div
        className="workspace-card"
        style={{
          marginTop: "30px"
        }}
      >

        <h2>
          🎯 Task Progress
        </h2>

        <p>
          Your current academic task completion.
        </p>


        <div
          style={{
            marginTop: "20px"
          }}
        >

          <div
            style={{
              width: "100%",
              height: "15px",
              background: "#E5E7EB",
              borderRadius: "10px",
              overflow: "hidden"
            }}
          >

            <div
              style={{
                width: `${taskCompletionRate}%`,
                height: "100%",
                background: "#8B5CF6",
                borderRadius: "10px"
              }}
            />

          </div>


          <p
            style={{
              marginTop: "10px"
            }}
          >
            {completedTasks} of{" "}
            {totalTasks} tasks completed
          </p>

        </div>

      </div>

    </main>
  );
}

export default Analytics;