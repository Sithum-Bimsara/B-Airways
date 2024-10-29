"use client";

import React, { useState, useEffect, useContext } from 'react';
import './UserProfile.css';
import { AuthContext } from '../context/AuthContext';

const UserProfile = () => {
  const { username, role, userId } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pastBookings, setPastBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/getUserData', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ userId })
        });
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchPastBookings = async () => {
      setLoading(true);  // Show loading indicator while fetching data
      try {
        const response = await fetch(`/api/getPastBookingsData?booking_type=before`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });
        if (!response.ok) throw new Error('Failed to fetch booking data');
        const data = await response.json();
        setPastBookings(data.bookings);  
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    

    const fetchUpcomingBookings = async () => {
      setLoading(true);  // Show loading indicator while fetching data
      try {
        const response = await fetch(`/api/getUpcomingBookingsData?booking_type=after`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });
        if (!response.ok) throw new Error('Failed to fetch booking data');
        const data = await response.json();
        setUpcomingBookings(data.bookings);  // Assuming the response is { bookings: [...] }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
    fetchUpcomingBookings();
    fetchPastBookings();
  }, [userId]);

  const handlePasswordChange = () => {
    if (currentPassword !== userData.currentPassword) {
      alert("Current password is incorrect. Please try again.");
      return;
    }
    if (newPassword === confirmPassword) {
      alert(`Password changed successfully to: ${newPassword}`);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordModalOpen(false);
    } else {
      alert("New passwords do not match. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const firstLetter = username ? username.charAt(0) : '';

  return (
    <div className="profile-container">
      <div className="profile-main">
        <div className="profile-picture">
          <div className="letter-avatar">{firstLetter}</div>
        </div>
        <h2>{userData.username}</h2>
        
        <section className="profile-section">
          <div className="profile-detail-row">
            <p>First name: {userData.firstName}</p>
            <p>Last name: {userData.lastName}</p>
            <p>Born: {new Date(userData.dateOfBirth).toISOString().split('T')[0]}</p>
            <p>Country: {userData.country}</p>
            <p>Gender: {userData.gender}</p>
            <p>NIC: {userData.nicCode}</p>
            <p>Email: {userData.email}</p>
          </div>
        </section>

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
    {pastBookings?.length > 0 ? (
      pastBookings.map((booking, index) => (
        <div key={index} className="flight-card">
          <p><strong>Flight:</strong> {booking.Flight_ID}</p>
          <p><strong>Date:</strong> {new Date(booking.Date).toLocaleDateString()}</p>
          <p><strong>Destination:</strong> {booking.Destination_Airport_Name}</p>
        </div>
      ))
    ) : (
      <p>No past flights available.</p>
    )}
  </div>

        {/* Upcoming Flights Box */}
        <div className="flights-box">
    <h2>Upcoming Flights</h2>
    {upcomingBookings?.length > 0 ? (
      upcomingBookings.map((booking, index) => (
        <div key={index} className="flight-card">
          <p><strong>Flight:</strong> {booking.Flight_ID}</p>
          <p><strong>Date:</strong> {new Date(booking.Date).toLocaleDateString()}</p>
          <p><strong>Destination:</strong> {booking.Destination_Airport_Name}</p>
        </div>
      ))
    ) : (
      <p>No upcoming flights available.</p>
    )}
  </div>
  
      </div>
    </div>
  );
};

export default UserProfile;
