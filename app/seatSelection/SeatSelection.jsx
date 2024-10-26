"use client";
import React, { useEffect, useState } from 'react';
import './SeatSelection.css';
import { useRouter } from 'next/navigation';

const SeatSelection = () => {
  const [seatMap, setSeatMap] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState({});
  const [loading, setLoading] = useState(true);
  const [modelId, setModelId] = useState(null);
  const router = useRouter();

  // Define total seats based on model ID
  const modelSeatConfig = {
    1: { totalSeats: 160, seatsPerRow: 6 }, // Example configuration
    2: { totalSeats: 180, seatsPerRow: 6 },
    3: { totalSeats: 489, seatsPerRow: 6 },
  };

  // Generate seat map based on total seats
  const generateSeatMap = (totalSeats, seatsPerRow) => {
    const seats = [];
    for (let seatNumber = 1; seatNumber <= totalSeats; seatNumber++) {
      const paddedSeatNumber = seatNumber.toString().padStart(3, '0');
      seats.push({
        seatId: paddedSeatNumber,
        isAvailable: true,
        isAisle: false,
      });

      // Optionally, add aisle logic if needed
      // Example: Add aisle after every 3 seats
      if (seatsPerRow > 0 && seatNumber % seatsPerRow === 0 && seatNumber !== totalSeats) {
        seats.push({ isAisle: true });
      }
    }
    return seats;
  };

  useEffect(() => {
    const fetchBookedSeats = async () => {
      const flightId = localStorage.getItem('selectedFlightId');
      if (!flightId) {
        alert('No flight selected.');
        router.push('/searchResults');
        return;
      }

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

        setModelId(data.modelId);
        const seatConfig = modelSeatConfig[data.modelId] || modelSeatConfig[1];
        const seats = generateSeatMap(seatConfig.totalSeats, seatConfig.seatsPerRow).map((seat) => ({
          seatId: seat.seatId,
          isAvailable: !data.bookedSeats.includes(seat.seatId),
          isAisle: seat.isAisle || false,
        }));
        setSeatMap(seats);
      } catch (err) {
        console.error(err);
        alert(err.message || 'Something went wrong while fetching seats.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookedSeats();
  }, [router]);

  const passengerIds = JSON.parse(localStorage.getItem('Passenger_IDs')) || [];

  const handleSeatSelect = (passengerId, seatId) => {
    // Prevent selecting a seat that's already selected by another passenger
    const alreadySelected = Object.values(selectedSeats).includes(seatId);
    if (alreadySelected) {
      alert('This seat is already selected by another passenger.');
      return;
    }

    setSelectedSeats((prev) => ({
      ...prev,
      [passengerId]: seatId,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validate that all passengers have selected seats
      for (const passengerId of passengerIds) {
        if (!selectedSeats[passengerId]) {
          throw new Error(`Please select a seat for passenger ID: ${passengerId}`);
        }
      }

      // Save selected seats to the database via an API call
      for (const [passengerId, seatId] of Object.entries(selectedSeats)) {
        const response = await fetch('/api/assignSeat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Passenger_ID: passengerId,
            Seat_ID: seatId,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to assign seat.');
        }
      }

      // Navigate to a confirmation page or another appropriate page
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
      {passengerIds.map((passengerId, index) => (
        <div key={passengerId} className="passenger-seat-selection">
          <h3>Passenger {index + 1}</h3>
          <div className="seat-map">
            {seatMap.map((seat, idx) => {
              if (seat.isAisle) {
                return <div key={`aisle-${idx}`} className="aisle"></div>;
              }
              return (
                <div
                  key={seat.seatId}
                  className={`seat ${!seat.isAvailable ? 'unavailable' : ''} ${
                    selectedSeats[passengerId] === seat.seatId ? 'selected' : ''
                  }`}
                  onClick={() => seat.isAvailable && handleSeatSelect(passengerId, seat.seatId)}
                >
                  {seat.seatId}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <button onClick={handleSubmit} className="confirm-seats-button">
        Confirm Seats
      </button>
    </div>
  );
};

export default SeatSelection;