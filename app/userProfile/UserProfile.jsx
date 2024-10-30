"use client";

import React, { useState, useEffect, useContext } from 'react';
import './UserProfile.css';
import { AuthContext } from '../context/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';
import Toast from '../components/Toast';

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
  const [passwordError, setPasswordError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

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
      setLoading(true);
      try {
        const response = await fetch('/api/getPastBookingsData?booking_type=before', {
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
      setLoading(true);
      try {
        const response = await fetch('/api/getUpcomingBookingsData?booking_type=after', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });
        if (!response.ok) throw new Error('Failed to fetch booking data');
        const data = await response.json();
        setUpcomingBookings(data.bookings);
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

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(data.message);
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordModalOpen(false);
      alert("Password changed successfully!");
      
    } catch (error) {
      setPasswordError("Failed to change password. Please try again.");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await fetch('/api/cancelBooking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      // Remove the cancelled booking from the state
      setUpcomingBookings(prevBookings => 
        prevBookings.filter(booking => booking.Booking_ID !== bookingId)
      );

      // Show success toast instead of alert
      setToast({
        show: true,
        message: 'Booking cancelled successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      // Show error toast instead of alert
      setToast({
        show: true,
        message: 'Failed to cancel booking. Please try again.',
        type: 'error'
      });
    } finally {
      setIsModalOpen(false);
      setSelectedBooking(null);
    }
  };

  const openCancelModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const firstLetter = username ? username.charAt(0) : '';

  return (
    <div className="profile-container">
      <div className="profile-main">
        <div className="profile-header">
          <div className="profile-picture">
            <div className="letter-avatar">{firstLetter}</div>
          </div>
          <h2>{userData.username}</h2>
        </div>

        <section className="profile-section">
          <h3>User Information</h3>
          <div className="profile-detail-row">
            <p><strong>First Name:</strong> {userData.firstName}</p>
            <p><strong>Last Name:</strong> {userData.lastName}</p>
            <p><strong>Date of Birth:</strong> {new Date(userData.dateOfBirth).toLocaleDateString()}</p>
            <p><strong>Country:</strong> {userData.country}</p>
            <p><strong>Gender:</strong> {userData.gender}</p>
            <p><strong>NIC:</strong> {userData.nicCode}</p>
            <p><strong>Email:</strong> {userData.email}</p>
          </div>
        </section>

        <section className="profile-section">
          <h3>Account Settings</h3>
          {passwordModalOpen ? (
            <form className="password-modal" onSubmit={handlePasswordChange}>
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {passwordError && <p className="error-message">{passwordError}</p>}
              <div className="button-group">
                <button type="submit" className="save-button">Save</button>
                <button type="button" className="cancel-button" onClick={() => {
                  setPasswordModalOpen(false);
                  setPasswordError("");
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}>Cancel</button>
              </div>
            </form>
          ) : (
            <button className="change-password-button" onClick={() => setPasswordModalOpen(true)}>Change Password</button>
          )}
        </section>
      </div>

      {/* Flights Container */}
      <div className="flights-container">
        {/* Past Flights Box */}
        <div className="flights-box">
          <h2>Past Flights</h2>
          {pastBookings?.length > 0 ? (
            <div className="flight-list">
              {pastBookings.map((booking, index) => (
                <div key={index} className="flight-card">
                  <p><strong>Booking ID:</strong> {booking.Booking_ID}</p>
                  <p><strong>Flight ID:</strong> {booking.Flight_ID}</p>
                  <p><strong>Date:</strong> {new Date(booking.Date).toLocaleDateString()}</p>
                  <p><strong>Passenger:</strong> {booking.Passenger_Name}</p>
                  <p><strong>Seat:</strong> {booking.Seat_ID}</p>
                  <p><strong>Class:</strong> {booking.Travel_Class}</p>
                  <p><strong>Destination:</strong> {booking.Destination_Airport_Name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No past flights available.</p>
          )}
        </div>

        {/* Upcoming Flights Box */}
        <div className="flights-box">
          <h2>Upcoming Flights</h2>
          {upcomingBookings?.length > 0 ? (
            <div className="flight-list">
              {upcomingBookings.map((booking, index) => (
                <div key={index} className="flight-card">
                  <p><strong>Booking ID:</strong> {booking.Booking_ID}</p>
                  <p><strong>Passenger:</strong> {booking.Passenger_Name}</p>
                  <p><strong>Seat:</strong> {booking.Seat_ID}</p>
                  <p><strong>Class:</strong> {booking.Travel_Class}</p>
                  <p><strong>Destination:</strong> {booking.Destination_Airport_Name}</p>
                  <p><strong>Date:</strong> {new Date(booking.Date).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {booking.Status}</p>
                  <button 
                    className="cancel-booking-button"
                    onClick={() => openCancelModal(booking)}
                  >
                    Cancel Booking
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No upcoming flights available.</p>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBooking(null);
        }}
        onConfirm={() => handleCancelBooking(selectedBooking?.Booking_ID)}
        bookingDetails={selectedBooking}
      />

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
    </div>
  );
};

export default UserProfile;