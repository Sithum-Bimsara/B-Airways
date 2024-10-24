'use client';

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null); // Added state for role

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/me');
      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
        setRole(data.role); // Set role from response
      } else {
        setUsername(null);
        setRole(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUsername(null);
      setRole(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const signOut = async () => {
    try {
      const response = await fetch('/api/signout', {
        method: 'POST',
      });
      if (response.ok) {
        setUsername(null);
        setRole(null); // Clear role on sign out
        window.location.reload();
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ username, role, setUsername, setRole, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;