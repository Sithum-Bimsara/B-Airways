'use client';

import React, { useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { username } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!username) {
      router.push('/'); // Redirect to home or sign-in page
    }
  }, [username, router]);

  if (!username) {
    return null; // Or a loading spinner
  }

  return children;
};

export default ProtectedRoute;