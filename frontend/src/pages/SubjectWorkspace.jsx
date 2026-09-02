import { useNavigate, useParams } from "react-router-dom";
import "../styles/SubjectWorkspace.css";
function SubjectWorkspace() {
    const { id } = useParams();
    const navigate = useNavigate();
  return (
    <main className="main-content">

      {/* Header */}

      <div className="workspace-header">

        <div>

          <h1>📘 Subject Workspace #{id}</h1>

          <p>
            Organize everything related to this subject.
          </p>

        </div>

        <button className="back-button">
          ← Back to Subjects
        </button>

      </div>

      {/* Info */}

      <div className="workspace-info">

        <div>

          <strong>👨‍🏫 Teacher</strong>

          <p>Satyam Sir</p>

        </div>

        <div>

          <strong>🎓 Semester</strong>

          <p>4</p>

        </div>

        <div>

          <strong>🕒 Last Updated</strong>

          <p>Today</p>

        </div>

      </div>

      {/* Feature Cards */}

      <div className="workspace-grid">

        <div
  className="workspace-card"
  onClick={() => navigate(`/notes/${id}`)}
  style={{ cursor: "pointer" }}
>

  <h2>📝 Notes</h2>

  <p>Create lecture notes.</p>

  <span>Open Notes →</span>

</div>

        <div className="workspace-card">

          <h2>📂 Resources</h2>

          <p>Books, PDFs & links.</p>

          <span>15 Files</span>

        </div>

        <div className="workspace-card">

          <h2>📄 Assignments</h2>

          <p>Track submissions.</p>

          <span>3 Pending</span>

        </div>

        <div className="workspace-card">

          <h2>📊 Attendance</h2>

          <p>Current attendance.</p>

          <span>92%</span>

        </div>

      </div>

      {/* AI */}

      <div className="workspace-ai">

        <h2>✨ StudentOS AI</h2>

        <p>

          You haven't revised Java for three days.
          Completing one lecture today will help keep
          you on track.

        </p>

        <button>

          Open AI Assistant →

        </button>

      </div>

    </main>
  );
}

export default SubjectWorkspace;