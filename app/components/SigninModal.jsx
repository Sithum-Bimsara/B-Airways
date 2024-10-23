'use client';

import React, { useState, useContext } from 'react';
import './SigninModal.css';
import { AuthContext } from '../context/AuthContext';

const SigninModal = ({ isOpen, onClose }) => {
  const { setUsername } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    identifier: '', // Can be username or email
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send POST request to the API
    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        // Update auth context
        setUsername(data.username);
        onClose();
        // Reload the page to update Navbar
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="identifier"
            value={credentials.identifier}
            onChange={handleChange}
            placeholder="Username or Email"
            required
          />
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <div className="modal-buttons">
            <button type="submit">Sign In</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SigninModal;