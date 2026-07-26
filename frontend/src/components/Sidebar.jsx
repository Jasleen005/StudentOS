function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        🎓 <span>StudentOS</span>
      </div>

      <nav className="sidebar-menu">
        <button className="menu-item active">🏠 Dashboard</button>
        <button className="menu-item">✅ Tasks</button>
        <button className="menu-item">📅 Study Planner</button>
        <button className="menu-item">🎯 Attendance</button>
        <button className="menu-item">📚 Subjects</button>
        <button className="menu-item">📊 Analytics</button>
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