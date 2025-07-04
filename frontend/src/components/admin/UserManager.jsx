import React, { useEffect, useState } from 'react';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setUsers);
  }, [token]);

  const updateRole = async (id, role) => {
    const res = await fetch(`/api/admin/users/${id}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ role })
    });
    if (res.ok) {
      setUsers(users.map(u => (u._id === id ? { ...u, role } : u)));
      setMessage('Role updated');
    }
  };

  const deleteUser = async id => {
    await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsers(users.filter(u => u._id !== id));
    setMessage('User deleted');
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>Users</h2>
      {message && <div>{message}</div>}
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.username} ({user.email}) - <b>{user.role}</b>
            <button onClick={() => updateRole(user._id, 'admin')}>Make Admin</button>
            <button onClick={() => updateRole(user._id, 'user')}>Make User</button>
            <button onClick={() => deleteUser(user._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManager; 