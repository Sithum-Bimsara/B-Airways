'use client';

import React, { useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/AuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { username, role } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!username) {
      router.push('/'); // Redirect to home or sign-in page
    } else if (role !== 'Admin') {
      router.push('/'); // Redirect non-admin users
    }
  }, [username, role, router]);

  if (!username || role !== 'Admin') {
    return null; // Or a loading spinner
  }

  return children;
};

export default AdminProtectedRoute;