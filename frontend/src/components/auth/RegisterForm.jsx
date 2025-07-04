import React, { useState } from 'react';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Registration successful!');
    } else {
      setMessage(data.error || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 32 }}>
      <h2>Register</h2>
      <label htmlFor="username">Username</label>
      <input id="username" name="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
      <label htmlFor="email">Email</label>
      <input id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <label htmlFor="password">Password</label>
      <input type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Register</button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default RegisterForm; 