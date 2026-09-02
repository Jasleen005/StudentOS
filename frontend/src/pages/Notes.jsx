import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Notes() {

  const { id } = useParams();
  const [title, setTitle] = useState("");
const [content, setContent] = useState("");
const [notes, setNotes] = useState([]);
const loadNotes = async () => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8001/notes/${id}`
    );

    const data = await response.json();

    setNotes(data);

  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  loadNotes();
}, [id]);
const saveNote = async () => {

  if (!title.trim() || !content.trim()) {
    alert("Please enter both title and content.");
    return;
  }

  const note = {
    subject_id: Number(id),
    title: title,
    content: content,
    created_at: new Date().toISOString()
  };

  try {

    const response = await fetch(
      "http://127.0.0.1:8001/notes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(note)
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save note");
    }

    await loadNotes();

    setTitle("");
    setContent("");

  } catch (error) {

    console.log(error);
    alert("Failed to save note.");

  }
};

  return (

    <div style={{ padding: "30px", width: "100%" }}>

      <h1>📝 Notes</h1>

      <p>Subject ID: {id}</p>

      <hr />

      <h2>Add Note</h2>

      <input
  type="text"
  placeholder="Title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "15px"
  }}
/>

      <textarea
  placeholder="Write your notes..."
  rows="8"
  value={content}
  onChange={(e) => setContent(e.target.value)}
  style={{
    width: "100%",
    padding: "10px"
  }}
/>

      <br />
      <br />

      <button onClick={saveNote}>
  Save Note
</button>

      <hr />

      <h2>My Notes</h2>

{notes.length === 0 ? (

  <p>No notes yet.</p>

) : (

  notes.map((note) => (

    <div
      key={note.id}
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "15px",
        marginTop: "15px"
      }}
    >

      <h3>{note.title}</h3>

      <p>{note.content}</p>

      <small>
        Created: {new Date(note.created_at).toLocaleString()}
      </small>

    </div>

  ))

)}

    </div>

  );

}

export default Notes;