import { useState } from 'react'

function Tasks() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'DBMS Assignment',
      subject: 'DBMS',
      deadline: 'Tomorrow',
      priority: 'High',
      completed: false,
    },
    {
      id: 2,
      title: 'Revise Operating Systems',
      subject: 'Operating Systems',
      deadline: 'Jul 29',
      priority: 'Medium',
      completed: false,
    },
    {
      id: 3,
      title: 'Practice DSA Problems',
      subject: 'Data Structures',
      deadline: 'Jul 30',
      priority: 'Low',
      completed: false,
    },
  ])

  const [showForm, setShowForm] = useState(false)

  const [newTask, setNewTask] = useState({
    title: '',
    subject: '',
    deadline: '',
    priority: 'Medium',
  })

  // Add a new task
  const handleAddTask = () => {
    if (!newTask.title || !newTask.subject || !newTask.deadline) {
      alert('Please fill in all fields.')
      return
    }

    const task = {
      id: Date.now(),
      title: newTask.title,
      subject: newTask.subject,
      deadline: newTask.deadline,
      priority: newTask.priority,
      completed: false,
    }

    setTasks([...tasks, task])

    setNewTask({
      title: '',
      subject: '',
      deadline: '',
      priority: 'Medium',
    })

    setShowForm(false)
  }

  // Mark task complete / undo
  const handleCompleteTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }
  const handleDeleteTask = (id) => {
  setTasks(tasks.filter((task) => task.id !== id))
}

  return (
    <main className="main-content">

      {/* Header */}
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

      {/* Add Task Form */}
      {showForm && (
        <div className="task-form">

          <input
            type="text"
            placeholder="Task name"
            value={newTask.title}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                title: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Subject"
            value={newTask.subject}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                subject: e.target.value,
              })
            }
          />

          <input
            type="date"
            value={newTask.deadline}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                deadline: e.target.value,
              })
            }
          />

          <select
            value={newTask.priority}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                priority: e.target.value,
              })
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

      {/* Task List */}
      <div className="task-list">

        {tasks.map((task) => (
          <div
            className={`task-card ${
              task.completed ? 'completed' : ''
            }`}
            key={task.id}
          >

            <div className="task-info">
              <h3>{task.title}</h3>

              <p>
                {task.subject} • Due {task.deadline}
              </p>
            </div>

            <div className="task-actions">

              <span
                className={`priority ${task.priority.toLowerCase()}`}
              >
                {task.priority}
              </span>

              <button
                className="complete-button"
                onClick={() => handleCompleteTask(task.id)}
              >
                {task.completed ? '↩ Undo' : '✓ Complete'}
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