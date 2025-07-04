import React, { useState } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      setMessage('Login successful!');
    } else {
      setMessage(data.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 32 }}>
      <h2>Login</h2>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <label htmlFor="password">Password</label>
      <input type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Login</button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default LoginForm; 