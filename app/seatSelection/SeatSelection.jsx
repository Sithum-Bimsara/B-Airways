"use client";
import React, { useEffect, useState } from 'react';
import './SeatSelection.css';
import { useRouter } from 'next/navigation';

const SeatSelection = () => {
  const [seatMap, setSeatMap] = useState([]);
  const [passengerData, setPassengerData] = useState([]);
  const [selectedPassengerIndex, setSelectedPassengerIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modelId, setModelId] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [seatPrices, setSeatPrices] = useState({});
  const router = useRouter();

  // Define total seats based on model ID
  const modelSeatConfig = {
    1: { totalSeats: 160, seatsPerRow: 6 }, // Example configuration
    2: { totalSeats: 180, seatsPerRow: 6 },
    3: { totalSeats: 489, seatsPerRow: 6 },
  };

  // Generate seat map based on total seats and booked seats
  const generateSeatMap = (totalSeats, seatsPerRow, bookedSeats) => {
    const seats = [];
    for (let seatNumber = 1; seatNumber <= totalSeats; seatNumber++) {
      const paddedSeatNumber = seatNumber.toString().padStart(3, '0');
      const isBooked = bookedSeats.includes(paddedSeatNumber);
      seats.push({
        seatId: paddedSeatNumber,
        isAvailable: !isBooked,
        isAisle: false,
      });

      // Optionally, add aisle logic if needed
      if (seatsPerRow > 0 && seatNumber % seatsPerRow === 0 && seatNumber !== totalSeats) {
        seats.push({ isAisle: true });
      }
    }
    return seats;
  };

  // Fetch seat prices based on flight ID and travel class
  const fetchSeatPrices = async (flightId) => {
    try {
      const response = await fetch('/api/getSeatPrices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ flightId }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch seat prices.');
      }

      const data = await response.json();
      setSeatPrices(data.prices); // Expecting { 'Economy': 450, 'Business': 900, 'Platinum': 1500 }
    } catch (error) {
      console.error(error);
      alert(error.message || 'Error fetching seat prices.');
    }
  };

  useEffect(() => {
    const fetchBookedSeats = async () => {
      const flightId = localStorage.getItem('selectedFlightId');
      if (!flightId) {
        alert('No flight selected.');
        router.push('/searchResults');
        return;
      }

      // Retrieve PassengerData from localStorage
      const storedPassengerData = JSON.parse(localStorage.getItem('PassengerData')) || [];
      setPassengerData(storedPassengerData);

      try {
        const response = await fetch('/api/getBookedSeats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ flightId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch booked seats.');
        }

        // Corrected Destructuring
        const { modelId, bookedSeats } = data;

        setModelId(modelId);
        const seatConfig = modelSeatConfig[modelId] || modelSeatConfig[1];
        let seats = generateSeatMap(seatConfig.totalSeats, seatConfig.seatsPerRow, bookedSeats || []);

        // Mark seats already assigned to passengers as unavailable
        storedPassengerData.forEach((passenger) => {
          if (passenger.Seat) {
            seats = seats.map((seat) =>
              seat.seatId === passenger.Seat ? { ...seat, isAvailable: false } : seat
            );
          }
        });

        setSeatMap(seats);

        // Fetch seat prices
        await fetchSeatPrices(flightId);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert(err.message || 'Something went wrong while fetching seat data.');
        setLoading(false);
      }
    };

    fetchBookedSeats();
  }, [router]);

  // Handle passenger selection
  const handlePassengerSelect = (index) => {
    setSelectedPassengerIndex(index);
  };

  // Identify travel class based on seat ID
  const getTravelClass = (seatId) => {
    // Assuming seat numbering: 
    // Economy: 001-100, Business: 101-150, Platinum: 151-160
    const seatNumber = parseInt(seatId, 10);
    if (seatNumber >= 1 && seatNumber <= 100) return 'Economy';
    if (seatNumber >= 101 && seatNumber <= 150) return 'Business';
    if (seatNumber >= 151 && seatNumber <= 160) return 'Platinum';
    return 'Economy'; // Default
  };

  // Handle seat selection
  const handleSeatSelect = (seatId) => {
    if (selectedPassengerIndex === null) {
      alert('Please select a passenger first.');
      return;
    }

    const selectedPassenger = passengerData[selectedPassengerIndex];
    const travelClass = getTravelClass(seatId);
    const price = seatPrices[travelClass] || 0;

    // Assign seat to passenger
    const updatedPassengerData = [...passengerData];
    const previousSeat = updatedPassengerData[selectedPassengerIndex].Seat;

    // If passenger had a previous seat, make it available again
    if (previousSeat) {
      setSeatMap((prevSeats) =>
        prevSeats.map((seat) =>
          seat.seatId === previousSeat ? { ...seat, isAvailable: true } : seat
        )
      );

      // Subtract previous seat price
      const previousTravelClass = getTravelClass(previousSeat);
      const previousPrice = seatPrices[previousTravelClass] || 0;
      setTotalPrice((prevTotal) => prevTotal - previousPrice);
    }

    updatedPassengerData[selectedPassengerIndex].Seat = seatId;
    setPassengerData(updatedPassengerData);
    localStorage.setItem('PassengerData', JSON.stringify(updatedPassengerData));

    // Update seat map
    setSeatMap((prevSeats) =>
      prevSeats.map((seat) =>
        seat.seatId === seatId ? { ...seat, isAvailable: false } : seat
      )
    );

    // Update total price
    setTotalPrice((prevTotal) => prevTotal + price);
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate all passengers have assigned seats
    for (let i = 0; i < passengerData.length; i++) {
      if (!passengerData[i].Seat) {
        alert(`Please assign a seat for Passenger ${i + 1}.`);
        return;
      }
    }

    // Optionally, send seat assignments to the backend
    try {
      const flightId = localStorage.getItem('selectedFlightId');
      const response = await fetch('/api/assignSeat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flightId,
          passengerData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to assign seats.');
      }

      // Update local storage with total price
      localStorage.setItem('TotalPrice', JSON.stringify(totalPrice));

      // Navigate to confirmation page
      router.push('/confirmation');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Something went wrong while assigning seats.');
    }
  };

  if (loading) {
    return <p>Loading seat map...</p>;
  }

  return (
    <div className="seat-selection-container">
      <h2>Select Your Seats</h2>

      {/* Passenger List */}
      <div className="passenger-list-section">
        <h3>Passengers</h3>
        <ul className="passenger-list">
          {passengerData.map((passenger, index) => (
            <li
              key={passenger.Passenger_ID}
              className={`passenger-item ${selectedPassengerIndex === index ? 'selected' : ''}`}
              onClick={() => handlePassengerSelect(index)}
            >
              Passenger {index + 1} {passenger.Seat && `- Seat ${passenger.Seat}`}
            </li>
          ))}
        </ul>
      </div>

      {/* Seat Map */}
      <div className="seat-map-section">
        <h3>Seat Map</h3>
        <div className="seat-map">
          {seatMap.map((seat, idx) => {
            if (seat.isAisle) {
              return <div key={`aisle-${idx}`} className="aisle"></div>;
            }
            return (
              <div
                key={seat.seatId}
                className={`seat ${!seat.isAvailable ? 'unavailable' : 'available'} ${
                  selectedPassengerIndex !== null && passengerData[selectedPassengerIndex].Seat === seat.seatId
                    ? 'selected'
                    : ''
                }`}
                onClick={() => seat.isAvailable && handleSeatSelect(seat.seatId)}
                title={seat.isAvailable ? `Seat ${seat.seatId} (${getTravelClass(seat.seatId)})` : `Seat ${seat.seatId} - Booked`}
                aria-label={`Seat ${seat.seatId} ${seat.isAvailable ? getTravelClass(seat.seatId) : 'Booked'}`}
                role="button"
                tabIndex={seat.isAvailable ? 0 : -1}
              >
                {seat.seatId}
              </div>
            );
          })}
        </div>
      </div>

      {/* Total Price */}
      <div className="total-price-section">
        <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
      </div>

      <button onClick={handleSubmit} className="confirm-seats-button">
        Confirm Seats
      </button>
    </div>
  );
};

export default SeatSelection;