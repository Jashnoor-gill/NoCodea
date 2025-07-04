import React from 'react';
import '../../App.css';

const ThemeProvider = ({ children }) => (
  <div className="theme-default">
    {children}
  </div>
);

export default ThemeProvider; 