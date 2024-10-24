"use client";
import React, { useState } from 'react';
import './PassengerForm.css'; // Import the CSS file

const PassengerForm = () => {
  const [passengers, setPassengers] = useState([
    { Passenger_ID: '', Passport_Number: '', Passport_Expire_Date: '', Name: '', Date_of_birth: '', Gender: '' }
  ]);

  const handlePassengerChange = (e, index) => {
    const { name, value } = e.target;
    const updatedPassengers = [...passengers];
    updatedPassengers[index][name] = value;
    setPassengers(updatedPassengers);
  };

  const addPassenger = () => {
    setPassengers([
      ...passengers,
      { Name: '', Passport_Number: '', Passport_Expire_Date: '', Date_of_birth: '', Gender: '' }
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(passengers);
  };

  return (
    <div className="passenger-form-container">
      <h2 className="form-title">Passenger Information</h2>
      <form onSubmit={handleSubmit} className="passenger-form">
        {passengers.map((passenger, index) => (
          <div key={index} className="section passenger-details">
            <h3>Passenger {index + 1}</h3>
            <div className="form-row">
              <input
                type="text"
                name="Name"
                placeholder="Name"
                value={passenger.Name}
                onChange={(e) => handlePassengerChange(e, index)}
              />
              <label htmlFor={`dob-${index}`}>Date of Birth</label>
                <input
                  type="date"
                  id={`dob-${index}`}
                  name="Date_of_birth"
                  placeholder="Date of Birth"
                  value={passenger.Date_of_birth}
                  onChange={(e) => handlePassengerChange(e, index)}
                />
              <select
                name="Gender"
                value={passenger.Gender}
                onChange={(e) => handlePassengerChange(e, index)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>


            <div className="form-row">
              <input
                type="text"
                name="Passport_Number"
                placeholder="Passport Number"
                value={passenger.Passport_Number}
                onChange={(e) => handlePassengerChange(e, index)}
              />

<label htmlFor={`passport-expire-${index}`}>Passport Expiry Date</label>
                <input
                  type="date"
                  id={`passport-expire-${index}`}
                  name="Passport_Expire_Date"
                  placeholder="Passport Expiry Date"
                  value={passenger.Passport_Expire_Date}
                  onChange={(e) => handlePassengerChange(e, index)}
                />
            </div>        
          </div>
        ))}

        <div className="form-actions">
          <button type="button" className="add-passenger-button" onClick={addPassenger}>
            Add Passenger
          </button>
          <button type="button" className="seat-selection-button">Go to seat selection</button>
        </div>
      </form>
    </div>
  );
};

export default PassengerForm;
