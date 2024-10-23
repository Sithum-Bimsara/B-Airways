'use client';

import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import UserProfile from './UserProfile';

const UserProfilePage = () => {
  return (
    <ProtectedRoute>
      <UserProfile />
    </ProtectedRoute>
  );
};

export default UserProfilePage;