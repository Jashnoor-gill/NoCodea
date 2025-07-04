import React, { useEffect, useState } from 'react';

const PostManager = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('/api/content/posts')
      .then(res => res.json())
      .then(setPosts);
  }, []);

  const handleAdd = async e => {
    e.preventDefault();
    const res = await fetch('/api/content/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    });
    if (res.ok) {
      const newPost = await res.json();
      setPosts([...posts, newPost]);
      setTitle('');
      setContent('');
    }
  };

  const handleDelete = async id => {
    await fetch(`/api/content/posts/${id}`, { method: 'DELETE' });
    setPosts(posts.filter(p => p._id !== id));
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>Posts</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: 16 }}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" required />
        <button type="submit">Add Post</button>
      </form>
      <ul>
        {posts.map(post => (
          <li key={post._id || post.id}>
            <strong>{post.title}</strong>
            <button onClick={() => handleDelete(post._id || post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostManager; 