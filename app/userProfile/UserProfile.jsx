'use client';

import React, { useState, useEffect } from 'react';
import './UserProfile.css';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/me');
        if (response.ok) {
          const data = await response.json();
          // Fetch user details from the database as needed
          // For demonstration, using the username from the session
          setUserData({
            userName: data.username,
            firstname: "Sample", // Replace with actual data
            lastname: "User",
            birthDate: "1990-01-01",
            address: "Sample Address",
            email: "sample@example.com",
            mobile: "(123) 456-7890",
            passportDetails: {
              nationality: "Sample",
              passportNumber: "A1234567",
              expiryDate: "2030-01-01",
              nationalID: "ID123456",
              redressNumber: "R123456",
              travelerNumber: "T123456",
            },
          });
        } else {
          console.error('Failed to fetch user data.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handlePasswordChange = async () => {
    if (newPassword === confirmPassword) {
      try {
        const response = await fetch('/api/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        });

        if (response.ok) {
          alert('Password changed successfully.');
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setPasswordModalOpen(false);
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error changing password:', error);
        alert('An unexpected error occurred.');
      }
    } else {
      alert("New passwords do not match. Please try again.");
    }
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="user-profile-container">
      <h2>User Profile</h2>
      {/* Profile Details */}
      <section className="profile-section">
        <h3>Personal Information</h3>
        {userData ? (
          <div className="profile-detail-row">
            <p>Username: {userData.userName}</p>
            <p>First Name: {userData.firstname}</p>
            <p>Last Name: {userData.lastname}</p>
            <p>Date of Birth: {userData.birthDate}</p>
            <p>Address: {userData.address}</p>
            <p>Email: {userData.email}</p>
            <p>Mobile: {userData.mobile}</p>
          </div>
        ) : (
          <div className="profile-detail-row">
            <p>Loading...</p>
          </div>
        )}
      </section>

      {/* Passport Details */}
      <section className="profile-section">
        <h3>Passport Details</h3>
        {userData.passportDetails ? (
          <div className="profile-detail-row">
            <p>Nationality: {userData.passportDetails.nationality || "N/A"}</p>
            <p>Passport Number: {userData.passportDetails.passportNumber || "N/A"}</p>
            <p>Expiry Date: {userData.passportDetails.expiryDate || "N/A"}</p>
            <p>National ID Number: {userData.passportDetails.nationalID || "N/A"}</p>
            <p>Redress Number: {userData.passportDetails.redressNumber || "N/A"}</p>
            <p>Known Traveler Number: {userData.passportDetails.travelerNumber || "N/A"}</p>
          </div>
        ) : (
          <div className="profile-detail-row">
            <p>Loading...</p>
          </div>
        )}
      </section>

      {/* Change Password Section */}
      <section className="profile-section">
        {passwordModalOpen ? (
          <>
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={handlePasswordChange}>Save Changes</button>
            <button onClick={() => setPasswordModalOpen(false)}>Cancel</button>
          </>
        ) : (
          <button onClick={() => setPasswordModalOpen(true)}>Change Password</button>
        )}
      </section>
    </div>
  );
};

export default UserProfile;