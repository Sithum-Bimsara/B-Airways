// components/Navbar.jsx
import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">B Airways</div>
      <ul className="menu">
        <li>Flights</li>
        <li>Hotels</li>
        <li>Packages</li>
      </ul>
      <div className="auth-buttons">
        <button className="signin-btn">Sign in</button>
        <button className="signup-btn">Sign up</button>
      </div>
    </nav>
  );
}

export default Navbar;
