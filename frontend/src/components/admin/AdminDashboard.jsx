import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => (
  <div style={{ padding: 32 }}>
    <h1>Admin Dashboard</h1>
    <ul>
      <li><Link to="/admin/posts">Manage Posts</Link></li>
      <li><Link to="/admin/categories">Manage Categories</Link></li>
      <li><Link to="/admin/users">Manage Users</Link></li>
      <li><Link to="/admin/plugins">Manage Plugins</Link></li>
      <li><Link to="/admin/themes">Manage Themes</Link></li>
    </ul>
  </div>
);

export default AdminDashboard; 