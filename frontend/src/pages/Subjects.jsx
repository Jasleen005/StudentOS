import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Subjects() {

  const [subjects, setSubjects] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [newSubject, setNewSubject] = useState({
    name: "",
    teacher: "",
    semester: "",
    color: "#8B5CF6",
    icon: "📘",
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = () => {
    fetch("http://127.0.0.1:8001/subjects")
      .then((res) => res.json())
      .then((data) => setSubjects(data))
      .catch((err) => console.log(err));
  };

  // Add Subject
  const handleAddSubject = () => {

    if (
      !newSubject.name ||
      !newSubject.teacher ||
      !newSubject.semester
    ) {
      alert("Please fill all fields.");
      return;
    }

    fetch("http://127.0.0.1:8001/subjects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSubject),
    })
      .then((res) => res.json())
      .then(() => {

        loadSubjects();

        setNewSubject({
          name: "",
          teacher: "",
          semester: "",
          color: "#8B5CF6",
          icon: "📘",
        });

        setShowForm(false);

      })
      .catch((err) => console.log(err));
  };

  return (
    <main className="main-content">

      <div className="tasks-header">

        <div>
          <h1>My Subjects</h1>
          <p>Organize your academic workspace.</p>
        </div>

        <button
          className="add-task-button"
          onClick={() => setShowForm(!showForm)}
        >
          + Add Subject
        </button>

      </div>

      {showForm && (
        <div className="task-form">

          <input
            type="text"
            placeholder="Subject Name"
            value={newSubject.name}
            onChange={(e) =>
              setNewSubject({
                ...newSubject,
                name: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Teacher Name"
            value={newSubject.teacher}
            onChange={(e) =>
              setNewSubject({
                ...newSubject,
                teacher: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Semester"
            value={newSubject.semester}
            onChange={(e) =>
              setNewSubject({
                ...newSubject,
                semester: e.target.value,
              })
            }
          />

          <input
            type="color"
            value={newSubject.color}
            onChange={(e) =>
              setNewSubject({
                ...newSubject,
                color: e.target.value,
              })
            }
          />

          <select
            value={newSubject.icon}
            onChange={(e) =>
              setNewSubject({
                ...newSubject,
                icon: e.target.value,
              })
            }
          >
            <option value="📘">📘</option>
            <option value="📙">📙</option>
            <option value="📗">📗</option>
            <option value="📕">📕</option>
            <option value="📔">📔</option>
            <option value="💻">💻</option>
            <option value="🧪">🧪</option>
            <option value="📐">📐</option>
          </select>

          <button
            className="save-task-button"
            onClick={handleAddSubject}
          >
            Save Subject
          </button>

        </div>
      )}

      <div className="subjects-grid">

        {subjects.map((subject) => (

          <div
            className="subject-card"
            key={subject.id}
          >

            <div
              className="subject-top"
              style={{
                background: subject.color
              }}
            >

              <div className="subject-icon">
                {subject.icon}
              </div>

            </div>

            <div className="subject-body">

              <h3>{subject.name}</h3>

              <p>👨‍🏫 {subject.teacher}</p>

              <p>Semester {subject.semester}</p>

              <button
  className="open-notes-btn"
  onClick={() => navigate(`/subjects/${subject.id}`)}
>
  Open Workspace →
</button>
            </div>

          </div>

        ))}

      </div>

    </main>
  );
}

export default Subjects;