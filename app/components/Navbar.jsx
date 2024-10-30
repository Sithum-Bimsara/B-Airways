'use client';

import React, { useContext } from 'react';
import './Navbar.css';
import SignupModal from './SignupModal';
import SigninModal from './SigninModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../assets/images/b-airways-logo.png';

function Navbar() {
  const [isSignupOpen, setIsSignupOpen] = React.useState(false);
  const [isSigninOpen, setIsSigninOpen] = React.useState(false);
  const { username, role, signOut } = useContext(AuthContext);

  const openSignupModal = () => setIsSignupOpen(true);
  const closeSignupModal = () => setIsSignupOpen(false);

  const openSigninModal = () => setIsSigninOpen(true);
  const closeSigninModal = () => setIsSigninOpen(false);

  return (
    <>
      <nav className="navbar">
      <div className="logo">
          <Link href="/">
            <Image 
              src={logo}
              alt="B Airways Logo"
              width={250} 
              height={150} 
              priority 
            />
          </Link>
        </div>
        <ul className="menu">
          <li>Flights</li>
          <li>Hotels</li>
          <li>Packages</li>
          {/* Admin Button */}
          {role === 'Admin' && (
            <li>
              <Link href="/adminpanel" className="admin-link">
                Admin Panel
              </Link>
            </li>
          )}
        </ul>
        <div className="auth-buttons">
          {username ? (
            <div className="profile-section">
              <Link href="/userProfile" className="profile-link">
                <FontAwesomeIcon icon={faUserCircle} size="2x" />
                <span>{username}</span>
              </Link>
              <button className="signout-btn" onClick={signOut}>Sign Out</button>
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