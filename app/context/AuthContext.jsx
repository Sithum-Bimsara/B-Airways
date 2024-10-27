'use client';

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null); 
  const [userId, setUserId] = useState(null); 

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/me');
      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
        setRole(data.role);
        setUserId(data.userId);
      } else {
        setUsername(null);
        setRole(null);
        setUserId(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUsername(null);
      setRole(null);
      setUserId(null);
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
        setRole(null);
        setUserId(null); 
        window.location.reload();
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ username, role,userId, setUsername, setRole,setUserId, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;