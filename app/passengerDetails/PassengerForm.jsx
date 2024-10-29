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

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      const updatedPassengers = passengers.filter((_, i) => i !== index);
      setPassengers(updatedPassengers);
    }
  };

  const fetchPassengerData = async (passportNumber, index) => {
    if (!passportNumber) {
      alert('Please enter a Passport Number.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/getPassengerData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Passport_Number: passportNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Passenger not found.');
      }

      const updatedPassengers = [...passengers];
      updatedPassengers[index] = {
        ...updatedPassengers[index],
        Passport_Number: passportNumber,
        Name: data.Name || '',
        Date_of_birth: data.Date_of_birth ? new Date(data.Date_of_birth).toISOString().split('T')[0] : '',
        Gender: data.Gender || '',
        Passport_Expire_Date: data.Passport_Expire_Date ? new Date(data.Passport_Expire_Date).toISOString().split('T')[0] : '',
      };
      setPassengers(updatedPassengers);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error fetching passenger data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const passengerData = [];

      for (const passenger of passengers) {
        if (!passenger.Passport_Number) {
          throw new Error('All passengers must have a Passport Number.');
        }

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

        passengerData.push({ Passenger_ID: result.Passenger_ID, Name: passenger.Name, Seat: "" });
      }

      localStorage.setItem('PassengerData', JSON.stringify(passengerData));
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
            <div className="passenger-header">
              <h3>Passenger {index + 1}</h3>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removePassenger(index)}
                  className="remove-passenger-button"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="form-group">
              <label htmlFor={`passport_number_${index}`}>Passport Number</label>
              <div className="input-with-button">
                <input
                  type="text"
                  id={`passport_number_${index}`}
                  name="Passport_Number"
                  placeholder="Enter Passport Number"
                  value={passenger.Passport_Number}
                  onChange={(e) => handlePassengerChange(e, index)}
                  required
                />
                <button
                  type="button"
                  onClick={() => fetchPassengerData(passenger.Passport_Number, index)}
                  disabled={loading}
                  className="fetch-data-button"
                >
                  {loading ? 'Fetching...' : 'Find Me'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor={`name_${index}`}>Name</label>
              <input
                type="text"
                id={`name_${index}`}
                name="Name"
                placeholder="Enter Full Name"
                value={passenger.Name}
                onChange={(e) => handlePassengerChange(e, index)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor={`dob_${index}`}>Date of Birth</label>
              <input
                type="date"
                id={`dob_${index}`}
                name="Date_of_birth"
                placeholder="Select Date of Birth"
                value={passenger.Date_of_birth}
                onChange={(e) => handlePassengerChange(e, index)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor={`gender_${index}`}>Gender</label>
              <select
                id={`gender_${index}`}
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

            <div className="form-group">
              <label htmlFor={`passport_expiry_${index}`}>Passport Expiry Date</label>
              <input
                type="date"
                id={`passport_expiry_${index}`}
                name="Passport_Expire_Date"
                placeholder="Select Passport Expiry Date"
                value={passenger.Passport_Expire_Date}
                onChange={(e) => handlePassengerChange(e, index)}
                required
              />
            </div>
          </div>
        ))}

        {error && <p className="error-message">{error}</p>}

        <div className="form-actions">
          <button
            type="button"
            className="add-passenger-button"
            onClick={addPassenger}
            disabled={loading}
          >
            Add Passenger
          </button>
          <button
            type="submit"
            className="seat-selection-button"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Go to Seat Selection'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PassengerForm;