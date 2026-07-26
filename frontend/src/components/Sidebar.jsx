import { NavLink } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        🎓 <span>StudentOS</span>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/dashboard" className="menu-item">
          🏠 Dashboard
        </NavLink>

        <NavLink to="/tasks" className="menu-item">
          ✅ Tasks
        </NavLink>

        <NavLink to="/planner" className="menu-item">
          📅 Study Planner
        </NavLink>

        <NavLink to="/attendance" className="menu-item">
          🎯 Attendance
        </NavLink>

        <NavLink to="/subjects" className="menu-item">
          📚 Subjects
        </NavLink>

        <NavLink to="/analytics" className="menu-item">
          📊 Analytics
        </NavLink>
      </nav>

      <div className="sidebar-ai">
        <button className="ai-button">
          ✨ Ask StudentOS AI
        </button>
      </div>
    </aside>
  )
}

export default Sidebar