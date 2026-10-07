import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Assignments() {
  const { id } = useParams();

  const [assignments, setAssignments] = useState([]);

  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");

  const loadAssignments = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8001/assignments/${id}`
      );

      if (!response.ok) {
        throw new Error("Failed to load assignments");
      }

      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.log(error);
      alert("Failed to load assignments.");
    }
  };

  useEffect(() => {
    loadAssignments();
  }, [id]);

  const addAssignment = async () => {
    if (!title.trim() || !deadline) {
      alert("Please fill all assignment details.");
      return;
    }

    const newAssignment = {
      subject_id: Number(id),
      title: title,
      deadline: deadline,
      status: "Pending",
      created_at: new Date().toISOString()
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8001/assignments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newAssignment)
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add assignment");
      }

      await loadAssignments();

      setTitle("");
      setDeadline("");
    } catch (error) {
      console.log(error);
      alert("Failed to add assignment.");
    }
  };

  const toggleStatus = async (assignment) => {
    const updatedAssignment = {
      subject_id: assignment.subject_id,
      title: assignment.title,
      deadline: assignment.deadline,
      status:
        assignment.status === "Pending"
          ? "Submitted"
          : "Pending",
      created_at: assignment.created_at
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8001/assignments/${assignment.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedAssignment)
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update assignment");
      }

      await loadAssignments();
    } catch (error) {
      console.log(error);
      alert("Failed to update assignment.");
    }
  };

  const deleteAssignment = async (assignmentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this assignment?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8001/assignments/${assignmentId}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete assignment");
      }

      await loadAssignments();
    } catch (error) {
      console.log(error);
      alert("Failed to delete assignment.");
    }
  };

  return (
    <main className="main-content">

      <div className="workspace-header">
        <div>
          <h1>📄 Assignments</h1>

          <p>
            Track assignments, deadlines and submission status.
          </p>

          <small>Subject ID: {id}</small>
        </div>
      </div>

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

      <div style={{ marginTop: "30px" }}>

        <h2>📚 My Assignments</h2>

        {assignments.length === 0 ? (
          <p>No assignments added yet.</p>
        ) : (
          assignments.map((assignment) => (

            <div
              key={assignment.id}
              className="workspace-card"
              style={{ marginTop: "15px" }}
            >

              <h3>{assignment.title}</h3>

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
                  toggleStatus(assignment)
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