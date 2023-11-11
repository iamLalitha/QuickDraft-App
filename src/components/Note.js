import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';

function Note({ note, onPinToggle, onDelete, onSave }) {
  const { id, title, tagline, body, pinned } = note;
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedTagline, setEditedTagline] = useState(tagline);
  const [editedBody, setEditedBody] = useState(body);

  const noteAnimation = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(-20px)' },
  });


  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Calling the onSave function 
    onSave({
      id,
      title: editedTitle,
      tagline: editedTagline,
      body: editedBody,
      pinned,
    });

    // Exit edit mode
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset edited values
    setEditedTitle(title);
    setEditedTagline(tagline);
    setEditedBody(body);
    setIsEditing(false);
  };

  return (
    <animated.div className={`note ${pinned ? 'pinned' : ''}`}>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <input
            type="text"
            value={editedTagline}
            onChange={(e) => setEditedTagline(e.target.value)}
          />
          <textarea
            value={editedBody}
            onChange={(e) => setEditedBody(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <div>
          <h3>{title}</h3>
          <p>{tagline}</p>
          <p>{body}</p>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={() => onPinToggle(id)}>{pinned ? 'Unpin' : 'Pin'}</button> 
          <button onClick={() => onDelete(id)}>Delete</button>
        </div>
      )}
    </animated.div>
  );
}

export default Note;


