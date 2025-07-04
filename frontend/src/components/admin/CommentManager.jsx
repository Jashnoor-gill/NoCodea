import React, { useEffect, useState } from 'react';

const CommentManager = ({ postId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!postId) return;
    fetch(`/api/comment/comments/${postId}`)
      .then(res => res.json())
      .then(setComments);
  }, [postId]);

  const handleDelete = async id => {
    // You can implement a delete endpoint in the backend if needed
    // For now, just filter out from UI
    setComments(comments.filter(c => c._id !== id));
  };

  if (!postId) return <div>Select a post to view comments.</div>;

  return (
    <div style={{ padding: 32 }}>
      <h3>Comments</h3>
      <ul>
        {comments.map(comment => (
          <li key={comment._id}>
            <strong>{comment.author?.username || 'Anonymous'}:</strong> {comment.content}
            <button onClick={() => handleDelete(comment._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentManager; 