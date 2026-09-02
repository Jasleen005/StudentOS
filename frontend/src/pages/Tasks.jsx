import { useEffect, useState } from 'react'

function Tasks() {
  const [tasks, setTasks] = useState([])
  const [showForm, setShowForm] = useState(false)

  const [newTask, setNewTask] = useState({
    title: "",
    subject: "",
    deadline: "",
    priority: "Medium",
  })

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8001/tasks")
      if (!response.ok) throw new Error("Failed to fetch tasks")
      const data = await response.json()
      setTasks(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.subject || !newTask.deadline) {
      alert("Please fill all fields.")
      return
    }

    try {
      const response = await fetch("http://127.0.0.1:8001/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask)
      })

      if (!response.ok) throw new Error("Failed to add task")

      await fetchTasks()

      setNewTask({
        title: "",
        subject: "",
        deadline: "",
        priority: "Medium"
      })

      setShowForm(false)

    } catch (err) {
      console.error(err)
    }
  }

  const handleCompleteTask = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8001/tasks/${id}`, {
        method: "PUT"
      })

      if (!response.ok) throw new Error("Failed to update task")

      await fetchTasks()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return

    try {
      const response = await fetch(`http://127.0.0.1:8001/tasks/${id}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Failed to delete task")

      await fetchTasks()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <main className="main-content">
      <div className="tasks-header">
        <div>
          <h1>My Tasks</h1>
          <p>Keep track of assignments, deadlines, and study work.</p>
        </div>

        <button
          className="add-task-button"
          onClick={() => setShowForm(!showForm)}
        >
          + Add Task
        </button>
      </div>

      {showForm && (
        <div className="task-form">
          <input
            type="text"
            placeholder="Task name"
            value={newTask.title}
            onChange={(e) =>
              setNewTask({ ...newTask, title: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Subject"
            value={newTask.subject}
            onChange={(e) =>
              setNewTask({ ...newTask, subject: e.target.value })
            }
          />

          <input
            type="date"
            value={newTask.deadline}
            onChange={(e) =>
              setNewTask({ ...newTask, deadline: e.target.value })
            }
          />

          <select
            value={newTask.priority}
            onChange={(e) =>
              setNewTask({ ...newTask, priority: e.target.value })
            }
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button
            className="save-task-button"
            onClick={handleAddTask}
          >
            Add Task
          </button>
        </div>
      )}

      <div className="task-list">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task-card ${task.completed ? "completed" : ""}`}
          >
            <div className="task-info">
              <h3>{task.title}</h3>
              <p>{task.subject} • Due {task.deadline}</p>
            </div>

            <div className="task-actions">
              <span className={`priority ${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>

              <button
                className="complete-button"
                onClick={() => handleCompleteTask(task.id)}
              >
                {task.completed ? "↩ Undo" : "✓ Complete"}
              </button>

              <button
                className="delete-button"
                onClick={() => handleDeleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Tasks