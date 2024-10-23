"use client";
import React, { useState } from 'react';
import './PassengerForm.css'; // Import the CSS file

const PassengerForm = () => {
  const [passenger, setPassenger] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    dob: '',
    email: '',
    phone: '',
    redressNumber: '',
    knownTravellerNumber: '',
  });

  const [emergencyContact, setEmergencyContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [bags, setBags] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassenger((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmergencyChange = (e) => {
    const { name, value } = e.target;
    setEmergencyContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBagChange = (e) => {
    const { value } = e.target;
    setBags(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(passenger, emergencyContact, bags);
  };

  return (
    <div className="passenger-form-container">
      <h2 className="form-title">Passenger Information</h2>
      <form onSubmit={handleSubmit} className="passenger-form">
        <div className="section passenger-details">
          <h3>Passenger 1 (Adult)</h3>
          <div className="form-row">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={passenger.firstName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="middleName"
              placeholder="Middle Name"
              value={passenger.middleName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={passenger.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              name="suffix"
              placeholder="Suffix"
              value={passenger.suffix}
              onChange={handleChange}
            />
            <input
              type="date"
              name="dob"
              placeholder="Date of Birth"
              value={passenger.dob}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={passenger.email}
              onChange={handleChange}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={passenger.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="section emergency-contact">
          <h3>Emergency Contact Information</h3>
          <div className="form-row">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={emergencyContact.firstName}
              onChange={handleEmergencyChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={emergencyContact.lastName}
              onChange={handleEmergencyChange}
            />
          </div>
          <div className="form-row">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={emergencyContact.email}
              onChange={handleEmergencyChange}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={emergencyContact.phone}
              onChange={handleEmergencyChange}
            />
          </div>
        </div>

        <div className="section bag-info">
          <h3>Bag Information</h3>
          <p>
            Each passenger is allowed one free carry-on bag and one personal item.
            First checked bag for each passenger is also free. Second bag check fees
            are waived for loyalty program members. See the full baggage policy.
          </p>
          <div className="form-row">
            <label htmlFor="bags">Checked Bags:</label>
            <input
              type="number"
              id="bags"
              min="1"
              value={bags}
              onChange={handleBagChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">Save and Close</button>
          <button type="submit" className="submit-button">Select Seats</button>
        </div>
      </form>
    </div>
  );
};

export default PassengerForm;