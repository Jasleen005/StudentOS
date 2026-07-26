import './App.css'
import Sidebar from './components/Sidebar'
import StatCard from './components/StatCard'

function App() {
  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <h1>Good morning 👋</h1>
        <p>Here’s what’s happening with your studies today.</p>
        <div className="stats-grid">
  <StatCard
    icon="✅"
    value="3"
    title="Tasks Due"
  />

  <StatCard
    icon="📚"
    value="2"
    title="Classes Today"
  />

  <StatCard
    icon="🎯"
    value="78%"
    title="Attendance"
  />
</div>

        <h2>Today’s Plan</h2>

        <p>📚 Data Structures — 9:00 AM</p>
        <p>💻 DBMS Assignment — Due tomorrow</p>
        <p>📝 Revise Operating Systems — 4:00 PM</p>
      </main>
    </div>
  )
}

export default App
