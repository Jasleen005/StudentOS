import { useState } from "react";
import { useParams } from "react-router-dom";

function Assignments() {
  const { id } = useParams();

  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: "Java OOP Assignment",
      subject: "Java",
      deadline: "2026-09-15",
      status: "Pending"
    },
    {
      id: 2,
      title: "DBMS SQL Queries",
      subject: "DBMS",
      deadline: "2026-09-18",
      status: "Pending"
    },
    {
      id: 3,
      title: "Data Structures Lab",
      subject: "Data Structures",
      deadline: "2026-09-10",
      status: "Submitted"
    }
  ]);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");

  const addAssignment = () => {
    if (!title.trim() || !subject.trim() || !deadline) {
      alert("Please fill all assignment details.");
      return;
    }

    const newAssignment = {
      id: Date.now(),
      title: title,
      subject: subject,
      deadline: deadline,
      status: "Pending"
    };

    setAssignments([...assignments, newAssignment]);

    setTitle("");
    setSubject("");
    setDeadline("");
  };

  const toggleStatus = (assignmentId) => {
    setAssignments(
      assignments.map((assignment) =>
        assignment.id === assignmentId
          ? {
              ...assignment,
              status:
                assignment.status === "Pending"
                  ? "Submitted"
                  : "Pending"
            }
          : assignment
      )
    );
  };

  const deleteAssignment = (assignmentId) => {
    setAssignments(
      assignments.filter(
        (assignment) => assignment.id !== assignmentId
      )
    );
  };

  return (
    <main className="main-content">

      {/* Header */}

      <div className="workspace-header">
        <div>
          <h1>📄 Assignments</h1>

          <p>
            Track assignments, deadlines and submission status.
          </p>

          <small>Subject ID: {id}</small>
        </div>
      </div>

      {/* Add Assignment */}

      <div className="workspace-card">

        <h2>➕ Add Assignment</h2>

        <input
          type="text"
          placeholder="Assignment title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px"
          }}
        />

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px"
          }}
        />

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px"
          }}
        />

        <button onClick={addAssignment}>
          Add Assignment
        </button>

      </div>

      {/* Assignment List */}

      <div style={{ marginTop: "30px" }}>

        <h2>📚 My Assignments</h2>

        {assignments.length === 0 ? (
          <p>No assignments yet.</p>
        ) : (
          assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="workspace-card"
              style={{ marginTop: "15px" }}
            >

              <h3>{assignment.title}</h3>

              <p>
                <strong>Subject:</strong>{" "}
                {assignment.subject}
              </p>

              <p>
                <strong>Deadline:</strong>{" "}
                {assignment.deadline}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {assignment.status}
              </p>

              <button
                onClick={() =>
                  toggleStatus(assignment.id)
                }
              >
                Mark as{" "}
                {assignment.status === "Pending"
                  ? "Submitted"
                  : "Pending"}
              </button>

              <button
                onClick={() =>
                  deleteAssignment(assignment.id)
                }
                style={{ marginLeft: "10px" }}
              >
                Delete
              </button>

            </div>
          ))
        )}

      </div>

    </main>
  );
}

export default Assignments;