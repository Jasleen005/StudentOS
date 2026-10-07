import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Resources() {
  const { id } = useParams();

  const [resources, setResources] = useState([]);

  const [name, setName] = useState("");
  const [type, setType] = useState("PDF");
  const [category, setCategory] = useState("Study Material");
  const [link, setLink] = useState("");


  // -------------------------
  // LOAD RESOURCES
  // -------------------------
  const loadResources = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8001/resources/${id}`
      );

      if (!response.ok) {
        throw new Error("Failed to load resources");
      }

      const data = await response.json();

      setResources(data);

    } catch (error) {
      console.log(error);
      alert("Failed to load resources.");
    }
  };


  useEffect(() => {
    loadResources();
  }, [id]);


  // -------------------------
  // ADD RESOURCE
  // -------------------------
  const addResource = async () => {

    if (!name.trim()) {
      alert("Please enter a resource name.");
      return;
    }

    const newResource = {
      subject_id: Number(id),
      title: name,
      type: type,
      category: category,
      link: link,
      created_at: new Date().toISOString()
    };

    try {

      const response = await fetch(
        "http://127.0.0.1:8001/resources",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newResource)
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add resource");
      }

      await loadResources();

      setName("");
      setType("PDF");
      setCategory("Study Material");
      setLink("");

    } catch (error) {

      console.log(error);
      alert("Failed to add resource.");

    }
  };


  // -------------------------
  // DELETE RESOURCE
  // -------------------------
  const deleteResource = async (resourceId) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resource?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      const response = await fetch(
        `http://127.0.0.1:8001/resources/${resourceId}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete resource");
      }

      await loadResources();

    } catch (error) {

      console.log(error);
      alert("Failed to delete resource.");

    }
  };


  return (
    <main className="main-content">

      <div className="workspace-header">

        <div>

          <h1>📂 Resources</h1>

          <p>
            Manage books, PDFs and links.
          </p>

          <small>
            Subject ID: {id}
          </small>

        </div>

      </div>


      {/* ADD RESOURCE */}

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

        <input
          type="text"
          placeholder="Resource link (optional)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
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

          <option value="PDF">
            PDF
          </option>

          <option value="Link">
            Link
          </option>

          <option value="Book">
            Book
          </option>

          <option value="Document">
            Document
          </option>

        </select>


        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px"
          }}
        >

          <option value="Study Material">
            Study Material
          </option>

          <option value="Notes">
            Notes
          </option>

          <option value="Lecture">
            Lecture
          </option>

          <option value="Reference">
            Reference
          </option>

        </select>


        <button onClick={addResource}>
          Add Resource
        </button>

      </div>


      {/* RESOURCE LIST */}

      <div style={{ marginTop: "30px" }}>

        <h2>📚 My Resources</h2>

        {resources.length === 0 ? (

          <p>
            No resources added yet.
          </p>

        ) : (

          resources.map((resource) => (

            <div
              key={resource.id}
              className="workspace-card"
              style={{
                marginTop: "15px"
              }}
            >

              <h3>
                {resource.title}
              </h3>

              <p>
                {resource.type} • {resource.category}
              </p>

              {resource.link && (

                <p>
                  🔗{" "}

                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Resource
                  </a>

                </p>

              )}

              <button
                onClick={() =>
                  deleteResource(resource.id)
                }
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