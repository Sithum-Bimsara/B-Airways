'use client';

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(null);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/me');
      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
      } else {
        setUsername(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUsername(null);
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
        window.location.reload();
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ username, setUsername, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;