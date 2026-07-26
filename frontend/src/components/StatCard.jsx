function StatCard({ icon, value, title }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div>
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  )
}

export default StatCard