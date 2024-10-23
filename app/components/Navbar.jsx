'use client';

import React, { useState, useEffect } from 'react';
import './Navbar.css';
import SignupModal from './SignupModal';
import SigninModal from './SigninModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isSigninOpen, setIsSigninOpen] = useState(false);
  const [username, setUsername] = useState('');

  // Check localStorage for username on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const openSignupModal = () => setIsSignupOpen(true);
  const closeSignupModal = () => setIsSignupOpen(false);

  const openSigninModal = () => setIsSigninOpen(true);
  const closeSigninModal = () => setIsSigninOpen(false);

  const handleSignOut = () => {
    localStorage.removeItem('username');
    setUsername('');
    window.location.reload();
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">B Airways</div>
        <ul className="menu">
          <li>Flights</li>
          <li>Hotels</li>
          <li>Packages</li>
        </ul>
        <div className="auth-buttons">
          {username ? (
            <div className="profile-section">
              <FontAwesomeIcon icon={faUserCircle} size="2x" />
              <span>{username}</span>
              <button className="signout-btn" onClick={handleSignOut}>Sign Out</button>
            </div>
          ) : (
            <>
              <button className="signin-btn" onClick={openSigninModal}>Sign in</button>
              <button className="signup-btn" onClick={openSignupModal}>Sign up</button>
            </>
          )}
        </div>
      </nav>
      <SignupModal isOpen={isSignupOpen} onClose={closeSignupModal} />
      <SigninModal isOpen={isSigninOpen} onClose={closeSigninModal} />
    </>
  );
}

export default Navbar;