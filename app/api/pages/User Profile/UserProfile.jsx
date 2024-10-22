"use client"; // Ensure this is marked as a client component

import React, { useState } from 'react';
import './UserProfile.css'; // Link to the CSS file

const UserProfile = () => {
  const [editMode, setEditMode] = useState(false); // For enabling editing
  const [userData, setUserData] = useState({
    userName: "Sanuji2002",
    firstname: "Sanuji",
    lastname: "Samarakoon",
    birthDate: "11 February 2002",
    address: "Sri Lanka",
    email: "sanujis1102@gmail.com",
    mobile: "(94) 774194482",
    passportDetails: {
      nationality: "",
      passportNumber: "",
      expiryDate: "",
      nationalID: "",
      redressNumber: "",
      travelerNumber: ""
    }
  });
  
  const [currentPassword, setCurrentPassword] = useState(""); // Current password input
  const [newPassword, setNewPassword] = useState(""); // New password input
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm new password input
  const [passwordModalOpen, setPasswordModalOpen] = useState(false); // For modal visibility

  const handleEditToggle = () => setEditMode(!editMode);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handlePassportChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      passportDetails: { ...userData.passportDetails, [name]: value }
    });
  };

  const handlePasswordChange = () => {
    if (newPassword === confirmPassword) {
      // Logic to handle password change (e.g., API call)
      alert(`Password changed successfully to: ${newPassword}`);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordModalOpen(false);
    } else {
      alert("New passwords do not match. Please try again.");
    }
  };

  const firstLetter = userData.userName.charAt(0); // Get the first letter of the name

  return (
    <div className="profile-container">
      {/* Main Profile Section */}
      <div className="profile-main">
        {/* Profile Picture */}
        <div className="profile-picture">
          <div className="letter-avatar">{firstLetter}</div>
        </div>

        <h2>{userData.userName}</h2>
        <p>User ID: 679445946</p>
        <p>Fill in your details to complete your profile. For a smooth travel experience, ensure your passport number and expiry date are valid.</p>

        {/* Edit Button */}
        <button onClick={handleEditToggle}>
          {editMode ? "Save Changes" : "Edit Details"}
        </button>

        {/* Personal Details Section */}
        <section className="profile-section">
          <h4>Personal Details</h4>
          {editMode ? (
            <div className="profile-detail-row">
              <input
                type="text"
                name="userName"
                value={userData.userName}
                onChange={handleInputChange}
                placeholder="Name"
              />
              <input
                type="text"
                name="birthDate"
                value={userData.birthDate}
                onChange={handleInputChange}
                placeholder="Birth Date"
              />
            </div>
          ) : (
            <div className="profile-detail-row">
              <p>First name: {userData.firstname}</p>
              <p>Last name: {userData.lastname}</p>
              <p>Born: {userData.birthDate}</p>
            </div>
          )}
          
        </section>

        {/* Contact Details Section */}
        <section className="profile-section">
          <h4>Your Contact Details</h4>
          {editMode ? (
            <div className="profile-detail-row">
              <input
                type="text"
                name="address"
                value={userData.address}
                onChange={handleInputChange}
                placeholder="Home Address"
              />
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
              <input
                type="tel"
                name="mobile"
                value={userData.mobile}
                onChange={handleInputChange}
                placeholder="Mobile"
              />
            </div>
          ) : (
            <div className="profile-detail-row">
              <p>Home Address: {userData.address}</p>
              <p>Email: {userData.email}</p>
              <p>Mobile: {userData.mobile}</p>
            </div>
          )}
        </section>

        {/* Travel Documents Section */}
        <section className="profile-section">
          <h4>Your Travel Documents</h4>
          {editMode ? (
            <div className="profile-detail-row">
              <input
                type="text"
                name="nationality"
                value={userData.passportDetails.nationality}
                onChange={handlePassportChange}
                placeholder="Nationality"
              />
              <input
                type="text"
                name="passportNumber"
                value={userData.passportDetails.passportNumber}
                onChange={handlePassportChange}
                placeholder="Passport Number"
              />
              <input
                type="text"
                name="expiryDate"
                value={userData.passportDetails.expiryDate}
                onChange={handlePassportChange}
                placeholder="Expiry Date"
              />
              <input
                type="text"
                name="nationalID"
                value={userData.passportDetails.nationalID}
                onChange={handlePassportChange}
                placeholder="National ID"
              />
              <input
                type="text"
                name="travelerNumber"
                value={userData.passportDetails.travelerNumber}
                onChange={handlePassportChange}
                placeholder="Known Traveler Number"
              />
            </div>
          ) : (
            <div className="profile-detail-row">
              <p>Passport Details: {userData.passportDetails.passportNumber || "N/A"}</p>
              <p>Nationality: {userData.passportDetails.nationality || "N/A"}</p>
              <p>Passport Number: {userData.passportDetails.passportNumber || "N/A"}</p>
              <p>Expiry Date: {userData.passportDetails.expiryDate || "N/A"}</p>
              <p>National ID Number: {userData.passportDetails.nationalID || "N/A"}</p>
              <p>Known Traveler Number: {userData.passportDetails.travelerNumber || "N/A"}</p>
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

    </div >
  );
}

export default UserProfile;