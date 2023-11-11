// src/components/NoteList.js
import React, { useState, useEffect } from 'react';
import Note from './Note';
import { useSpring, animated } from 'react-spring';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './NoteList.css';

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 6;
  const [newNote, setNewNote] = useState({ title: '', tagline: '', body: '' });
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const paginationAnimation = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(20px)' },
  });

  // Function to get notes from local storage
  const getNotesFromLocalStorage = () => {
    const storedNotes = JSON.parse(localStorage.getItem('notes'));
    if (storedNotes) {
      setNotes(storedNotes);
    }
  };

  // Function to update local storage with current notes
  const updateLocalStorage = (updatedNotes) => {
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  useEffect(() => {
    getNotesFromLocalStorage();
    document.body.classList.toggle('dark-mode',darkMode);
  }, [darkMode]);

  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = notes.slice(indexOfFirstNote, indexOfLastNote);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const notify = (message, type = 'success') => {
    toast[type](message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleAddNote = () => {
    if (!newNote.title || !newNote.tagline || !newNote.body) {
      setError('Please fill out all fields');
      notify('Note not added. Please fill out all fields.', 'error');
      return;
    }

    const updatedNotes = [...notes, { id: notes.length + 1, ...newNote, pinned: false }];
    setNotes(updatedNotes);
    updateLocalStorage(updatedNotes);

    setNewNote({ title: '', tagline: '', body: '' });
    setError(null);

    notify('Note added successfully');
  };

  const handleSave = (editedNote) => {
    const updatedNotes = notes.map((note) =>
      note.id === editedNote.id ? { ...note, ...editedNote } : note
    );

    setNotes(updatedNotes);
    updateLocalStorage(updatedNotes);

    notify('Note updated successfully');
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    updateLocalStorage(updatedNotes);

    notify('Note deleted successfully');
  };
  const handlePinToggle = (id) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, pinned: !note.pinned } : note
    );

    setNotes(updatedNotes);
    updateLocalStorage(updatedNotes);

    notify(`Note ${updatedNotes.find((note) => note.id === id).pinned ? 'pinned' : 'unpinned'} successfully`);
  };

  return (
    <animated.div style={paginationAnimation} className={`note-list ${darkMode ? 'dark-mode' : ''}`}>
    <div className="container">
      <h2 className={darkMode? 'dark-mode': ""}>Notes</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="add-note">
        <input
          type="text"
          placeholder="Title"
          id='ip2'
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Tagline"
          id='ip2'
          value={newNote.tagline}
          onChange={(e) => setNewNote({ ...newNote, tagline: e.target.value })}
        />
        <textarea
          placeholder="Note Body"
          id='ip2'
          value={newNote.body}
          onChange={(e) => setNewNote({ ...newNote, body: e.target.value })}
        />
        <button id='ip2' onClick={handleAddNote}>Add Note</button>
      </div>
      <br></br>
      <div className="note-grid">
        {currentNotes.map((note) => (
          <Note
            key={note.id}
            note={note}
            onPinToggle={handlePinToggle}
            onDelete={handleDeleteNote}
            onSave={handleSave}
          />
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: Math.ceil(notes.length / notesPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className="dark-mode-toggle">
        <label>Dark Mode</label>
        <input type="checkbox" checked={darkMode} onChange={handleToggleDarkMode} />
      </div>
      <ToastContainer />
    </div>
  </animated.div>
);
}


export default NoteList;





