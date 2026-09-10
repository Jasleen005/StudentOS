

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Notes() {

  const { id } = useParams();

  // Form data
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Notes loaded from database
  const [notes, setNotes] = useState([]);

  // ID of the note currently being edited
  const [editingNoteId, setEditingNoteId] = useState(null);


  // =========================
  // LOAD NOTES
  // =========================

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


  // Load notes when page opens
  useEffect(() => {

    loadNotes();

  }, [id]);


  // =========================
  // SAVE NEW NOTE
  // =========================

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


      // Reload notes after saving
      await loadNotes();


      // Clear form
      setTitle("");
      setContent("");


    } catch (error) {

      console.log(error);

      alert("Failed to save note.");

    }

  };


  // =========================
  // UPDATE NOTE
  // =========================

  const updateNote = async () => {

    if (!title.trim() || !content.trim()) {

      alert("Please enter both title and content.");

      return;

    }

    const updatedNote = {

  subject_id: Number(id),

  title: title,

  content: content,

  created_at: new Date().toISOString()

};

    try {

      const response = await fetch(
        `http://127.0.0.1:8001/notes/${editingNoteId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(updatedNote)
        }
      );


      if (!response.ok) {

        throw new Error("Failed to update note");

      }


      // Reload notes after updating
      await loadNotes();


      // Clear form
      setTitle("");
      setContent("");

      // Exit edit mode
      setEditingNoteId(null);


    } catch (error) {

      console.log(error);

      alert("Failed to update note.");

    }

  };

// DELETE NOTE
const deleteNote = async (noteId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this note?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch(
      `http://127.0.0.1:8001/notes/${noteId}`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete note");
    }

    await loadNotes();

  } catch (error) {
    console.log(error);
    alert("Failed to delete note.");
  }
};
  // =========================
  // START EDITING
  // =========================

  const startEditing = (note) => {

    setTitle(note.title);

    setContent(note.content);

    setEditingNoteId(note.id);

  };


  // =========================
  // CANCEL EDITING
  // =========================

  const cancelEditing = () => {

    setTitle("");

    setContent("");

    setEditingNoteId(null);

  };


  // =========================
  // PAGE UI
  // =========================

  return (

    <div style={{ padding: "30px", width: "100%" }}>

      <h1>📝 Notes</h1>

      <p>Subject ID: {id}</p>

      <hr />


      <h2>
        {editingNoteId ? "Edit Note" : "Add Note"}
      </h2>


      {/* TITLE */}

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


      {/* CONTENT */}

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


      {/* SAVE / UPDATE BUTTON */}

      {editingNoteId ? (

        <>
          <button onClick={updateNote}>
            Update Note
          </button>

          <button
            onClick={cancelEditing}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        </>

      ) : (

        <button onClick={saveNote}>
          Save Note
        </button>

      )}


      <hr />


      {/* MY NOTES */}

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
              Created:{" "}
              {new Date(note.created_at).toLocaleString()}
            </small>


            <br />
            <br />


            <button
              onClick={() => startEditing(note)}
            >
              Edit
            </button>

            <button
  onClick={() => deleteNote(note.id)}
  style={{ marginLeft: "10px" }}
>
  Delete
</button>

          </div>

        ))

      )}

    </div>

  );

}

export default Notes;