'use client';

import React, { useContext, useState } from 'react';
import './Navbar.css';
import SignupModal from './SignupModal';
import SigninModal from './SigninModal';
import Chatbot from './Chatbot';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faComments } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function Navbar() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isSigninOpen, setIsSigninOpen] = useState(false);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);
  const { username, role, signOut } = useContext(AuthContext);
  const router = useRouter();

  const openSignupModal = () => setIsSignupOpen(true);
  const closeSignupModal = () => setIsSignupOpen(false);

  const openSigninModal = () => setIsSigninOpen(true);
  const closeSigninModal = () => setIsSigninOpen(false);

  const toggleChatbot = () => setIsChatbotVisible(!isChatbotVisible);

  const scrollToSection = (sectionId) => {
    // If on homepage, scroll to section
    if (window.location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on different page, navigate to homepage then scroll
      router.push(`/#${sectionId}`);
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link href="/" className="logo">
          {/* You can also use an image element if desired */}
        </Link>
        <ul className="menu">
          <li>
            <button onClick={() => scrollToSection('flights')} className="nav-link">
              Destinations
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('hotels')} className="nav-link">
              Hotels
            </button>
          </li>
          <li>
            <button onClick={() => router.push('/Contactus')} className="nav-link">
              Contact Us
            </button>
          </li>

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
          <button className="chatbot-toggle-btn" onClick={toggleChatbot}>
            <FontAwesomeIcon icon={faComments} /> Chat
          </button>
          {username ? (
            <div className="profile-section">
              <Link href="/userProfile" className="profile-link">
                <FontAwesomeIcon icon={faUserCircle} size="2x" />
                <span>{username}</span>
              </Link>
              <button className="signout-btn" onClick={signOut}>
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <button className="signin-btn" onClick={openSigninModal}>
                Sign in
              </button>
              <button className="signup-btn" onClick={openSignupModal}>
                Sign up
              </button>
            </>
          )}
        </div>
      </nav>
      <SignupModal isOpen={isSignupOpen} onClose={closeSignupModal} />
      <SigninModal isOpen={isSigninOpen} onClose={closeSigninModal} />
      {isChatbotVisible && <Chatbot onClose={() => setIsChatbotVisible(false)} />}
    </>
  );
}

export default Navbar;