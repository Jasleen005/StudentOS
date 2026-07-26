import StatCard from '../components/StatCard'

function Dashboard() {
  return (
    <main className="main-content">

      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1>Good morning 👋</h1>
        <p>Here’s what’s happening with your studies today.</p>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <StatCard icon="✅" value="3" title="Tasks Due" />
        <StatCard icon="📚" value="2" title="Classes Today" />
        <StatCard icon="🎯" value="78%" title="Attendance" />
      </div>

      {/* Main Dashboard Area */}
      <div className="dashboard-grid">

        {/* Today's Plan */}
        <section className="dashboard-section">
          <h2>Today’s Plan</h2>

          <div className="plan-item">
            <span className="plan-time">9:00 AM</span>
            <div>
              <strong>Data Structures</strong>
              <p>Lecture</p>
            </div>
          </div>

          <div className="plan-item">
            <span className="plan-time">2:00 PM</span>
            <div>
              <strong>DBMS Assignment</strong>
              <p>Work on database assignment</p>
            </div>
          </div>

          <div className="plan-item">
            <span className="plan-time">4:00 PM</span>
            <div>
              <strong>Operating Systems</strong>
              <p>Revision session</p>
            </div>
          </div>
        </section>

        {/* Needs Attention */}
        <section className="dashboard-section">
          <h2>Needs Attention</h2>

          <div className="attention-item">
            <span>🔴</span>
            <div>
              <strong>DBMS Assignment</strong>
              <p>Due tomorrow</p>
            </div>
          </div>

          <div className="attention-item">
            <span>🟠</span>
            <div>
              <strong>OS Attendance</strong>
              <p>Currently at 72%</p>
            </div>
          </div>
        </section>

      </div>

      {/* AI Recommendation */}
      <section className="ai-insight">
        <div className="ai-insight-title">
          ✨ StudentOS AI Insight
        </div>

        <p>
          Your DBMS assignment is due tomorrow. Consider spending
          60 minutes on DBMS this evening before starting Operating
          Systems revision.
        </p>

        <button>View Study Suggestion →</button>
      </section>

    </main>
  )
}

export default Dashboard