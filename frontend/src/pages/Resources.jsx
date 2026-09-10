import { useState } from "react";
import { useParams } from "react-router-dom";

function Resources() {
  const { id } = useParams();

  const [resources, setResources] = useState([
    {
      id: 1,
      name: "Java Programming Notes",
      type: "PDF",
      category: "Notes"
    },
    {
      id: 2,
      name: "Data Structures Reference",
      type: "PDF",
      category: "Study Material"
    },
    {
      id: 3,
      name: "Important Lecture Link",
      type: "Link",
      category: "Lecture"
    }
  ]);

  const [name, setName] = useState("");
  const [type, setType] = useState("PDF");
  const [category, setCategory] = useState("Study Material");

  const addResource = () => {
    if (!name.trim()) {
      alert("Please enter a resource name.");
      return;
    }

    const newResource = {
      id: Date.now(),
      name: name,
      type: type,
      category: category
    };

    setResources([...resources, newResource]);

    setName("");
    setType("PDF");
    setCategory("Study Material");
  };

  const deleteResource = (resourceId) => {
    setResources(
      resources.filter((resource) => resource.id !== resourceId)
    );
  };

  return (
    <main className="main-content">

      <div className="workspace-header">
        <div>
          <h1>📂 Resources</h1>

          <p>
            Manage books, PDFs and links.
          </p>

          <small>Subject ID: {id}</small>
        </div>
      </div>

      <div className="workspace-card">

        <h2>➕ Add Resource</h2>

        <input
          type="text"
          placeholder="Resource name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px"
          }}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px"
          }}
        >
          <option value="PDF">PDF</option>
          <option value="Link">Link</option>
          <option value="Book">Book</option>
          <option value="Document">Document</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px"
          }}
        >
          <option value="Study Material">Study Material</option>
          <option value="Notes">Notes</option>
          <option value="Lecture">Lecture</option>
          <option value="Reference">Reference</option>
        </select>

        <button onClick={addResource}>
          Add Resource
        </button>

      </div>

      <div style={{ marginTop: "30px" }}>

        <h2>📚 My Resources</h2>

        {resources.length === 0 ? (
          <p>No resources added yet.</p>
        ) : (
          resources.map((resource) => (
            <div
              key={resource.id}
              className="workspace-card"
              style={{ marginTop: "15px" }}
            >

              <h3>{resource.name}</h3>

              <p>
                {resource.type} • {resource.category}
              </p>

              <button
                onClick={() => deleteResource(resource.id)}
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

export default Resources;