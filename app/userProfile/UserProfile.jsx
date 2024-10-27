"use client"; // Ensure this is marked as a client component

import React, { useState, useContext } from 'react';
import './UserProfile.css'; 
import { AuthContext } from '../context/AuthContext';

const UserProfile = () => {
  const { username, role, userId } = useContext(AuthContext);

  const [userData] = useState({
    userName: "Sanuji2002",
    firstname: "Sanuji",
    lastname: "Samarakoon",
    birthDate: "11 February 2002",
    gender: "Female",
    country: "Sri Lanka",
    email: "sanujis1102@gmail.com",
    NIC: "20208070",
   
  });
  
  const [currentPassword, setCurrentPassword] = useState(""); // Current password input
  const [newPassword, setNewPassword] = useState(""); // New password input
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm new password input
  const [passwordModalOpen, setPasswordModalOpen] = useState(false); // For modal visibility

  // Simulating the user's current password (this should come from your backend)
  const actualCurrentPassword = "userCurrentPassword"; // Replace this with the actual logic from your backend
  
  const handlePasswordChange = () => {
    if (currentPassword !== actualCurrentPassword) {
      alert("Current password is incorrect. Please try again.");
      return;
    }
    
    if (newPassword === confirmPassword) {
      // Perform password change logic (e.g., sending the new password to the server)
      alert(`Password changed successfully to: ${newPassword}`);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordModalOpen(false);
    } else {
      alert("New passwords do not match. Please try again.");
    }
  };

  const firstLetter = username ? username.charAt(0) : ''; // Get the first letter of the name

  // Define dummy flight data
  const flights = {
    upcoming: [
      { flight: "FL123", date: "2024-10-30", destination: "New York" },
      { flight: "FL456", date: "2024-11-15", destination: "London" },
      { flight: "FL789", date: "2024-12-01", destination: "Dubai" }
    ],
    past: [
      { flight: "FL101", date: "2024-09-20", destination: "Tokyo" },
      { flight: "FL202", date: "2024-08-05", destination: "Paris" },
      { flight: "FL303", date: "2024-07-15", destination: "Sydney" }
    ]
  };

  return (
    <div className="profile-container">
      {/* Main Profile Section */}
      <div className="profile-main">
        {/* Profile Picture */}
        <div className="profile-picture">
          <div className="letter-avatar">{firstLetter}</div>
        </div>

        <h2>{username}</h2>
        <h3>User ID: {userId}</h3>

        <section className="profile-section">

    <div className="profile-detail-row">
      <p>First name: {userData.firstname}</p>
      <p>Last name: {userData.lastname}</p>
      <p>Born: {userData.birthDate}</p>
      <p>Country: {userData.country}</p>
      <p>Gender: {userData.gender}</p>
      <p>NIC: {userData.NIC}</p> 
      <p>Email: {userData.email}</p>
    </div>
  
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
              <button onClick={handlePasswordChange}>Save</button>
              <button onClick={() => setPasswordModalOpen(false)}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setPasswordModalOpen(true)}>Change Password</button>
          )}
        </section>

      </div>

      {/* Flights Container */}
      <div className="flights-container">

        {/* Past Flights Box */}
  <div className="flights-box">
    <h2>Past Flights</h2>
    {flights.past.map((flight, index) => (
      <div key={index} className="flight-card">
        <p><strong>Flight:</strong> {flight.flight}</p>
        <p><strong>Date:</strong> {flight.date}</p>
        <p><strong>Destination:</strong> {flight.destination}</p>
      </div>
    ))}
  </div>
  {/* Upcoming Flights Box */}
  <div className="flights-box">
    <h2>Upcoming Flights</h2>
    {flights.upcoming.map((flight, index) => (
      <div key={index} className="flight-card">
        <p><strong>Flight:</strong> {flight.flight}</p>
        <p><strong>Date:</strong> {flight.date}</p>
        <p><strong>Destination:</strong> {flight.destination}</p>
      </div>
    ))}
  </div>

  
</div>
      </div>

    
  );
}

export default UserProfile;