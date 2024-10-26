"use client";
import React, { useState } from 'react';
import './PassengerForm.css';
import { useRouter } from 'next/navigation';

const PassengerForm = () => {
  const [passengers, setPassengers] = useState([
    { Passenger_ID: '', Passport_Number: '', Passport_Expire_Date: '', Name: '', Date_of_birth: '', Gender: '' }
  ]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePassengerChange = (e, index) => {
    const { name, value } = e.target;
    const updatedPassengers = [...passengers];
    updatedPassengers[index][name] = value;
    setPassengers(updatedPassengers);
  };

  const addPassenger = () => {
    setPassengers([
      ...passengers,
      { Passenger_ID: '', Passport_Number: '', Passport_Expire_Date: '', Name: '', Date_of_birth: '', Gender: '' }
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Array to hold all Passenger_IDs
      const passengerIds = [];

      for (const passenger of passengers) {
        const response = await fetch('/api/addPassenger', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Passport_Number: passenger.Passport_Number,
            Passport_Expire_Date: passenger.Passport_Expire_Date,
            Name: passenger.Name,
            Date_of_birth: passenger.Date_of_birth,
            Gender: passenger.Gender,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to add passenger.');
        }

        passengerIds.push(result.Passenger_ID);
      }

      // Save Passenger_IDs to local storage
      localStorage.setItem('Passenger_IDs', JSON.stringify(passengerIds));

      // Navigate to Seat Selection page
      router.push('/seatSelection');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
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
                required
              />
              <label htmlFor={`dob-${index}`}>Date of Birth</label>
              <input
                type="date"
                id={`dob-${index}`}
                name="Date_of_birth"
                placeholder="Date of Birth"
                value={passenger.Date_of_birth}
                onChange={(e) => handlePassengerChange(e, index)}
                required
              />
              <select
                name="Gender"
                value={passenger.Gender}
                onChange={(e) => handlePassengerChange(e, index)}
                required
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
                required
              />
              <label htmlFor={`passport-expire-${index}`}>Passport Expiry Date</label>
              <input
                type="date"
                id={`passport-expire-${index}`}
                name="Passport_Expire_Date"
                placeholder="Passport Expiry Date"
                value={passenger.Passport_Expire_Date}
                onChange={(e) => handlePassengerChange(e, index)}
                required
              />
            </div>        
          </div>
        ))}

        {error && <p className="error-message">{error}</p>}

        <div className="form-actions">
          <button type="button" className="add-passenger-button" onClick={addPassenger} disabled={loading}>
            Add Passenger
          </button>
          <button type="submit" className="seat-selection-button" disabled={loading}>
            {loading ? 'Processing...' : 'Go to Seat Selection'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PassengerForm;