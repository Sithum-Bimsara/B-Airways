"use client";
import React, { useEffect, useState, useContext } from 'react';
import './SeatSelection.css';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/AuthContext';

const SeatSelection = () => {
  const { userId } = useContext(AuthContext);
  const [seatMap, setSeatMap] = useState([]);
  const [passengerData, setPassengerData] = useState([]);
  const [selectedPassengerIndex, setSelectedPassengerIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modelId, setModelId] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [seatPrices, setSeatPrices] = useState({});
  const [membershipType, setMembershipType] = useState(null);
  const [discount, setDiscount] = useState(0);
  const router = useRouter();

  // Define total seats based on model ID
  const modelSeatConfig = {
    1: { totalSeats: 160, seatsPerRow: 6 },
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

  // Fetch membership type and discount based on user ID
  const fetchMembershipDetails = async (userId) => {
    try {
      const response = await fetch('/api/getMembershipDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch membership details.');
      }

      const data = await response.json();
      setMembershipType(data.membershipType);
      setDiscount(data.discount); // e.g., 0.10 for 10%
    } catch (error) {
      console.error(error);
      alert(error.message || 'Error fetching membership details.');
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

        // If userId exists, fetch membership details
        if (userId) {
          await fetchMembershipDetails(userId);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        alert(err.message || 'Something went wrong while fetching seat data.');
        setLoading(false);
      }
    };

    fetchBookedSeats();
  }, [router, userId]);

  // Handle passenger selection
  const handlePassengerSelect = (index) => {
    setSelectedPassengerIndex(index);
  };

  // Identify travel class based on seat ID
  const getTravelClass = (seatId) => {
    const seatNumber = parseInt(seatId, 10);
    if (modelId === 1) { // Boeing 737
      if (seatNumber >= 1 && seatNumber <= 114) return 'Economy';
      if (seatNumber >= 115 && seatNumber <= 144) return 'Business';
      if (seatNumber >= 145 && seatNumber <= 160) return 'Platinum';
    } else if (modelId === 2) { // Boeing 757
      if (seatNumber >= 1 && seatNumber <= 135) return 'Economy';
      if (seatNumber >= 136 && seatNumber <= 156) return 'Business';
      if (seatNumber >= 157 && seatNumber <= 180) return 'Platinum';
    } else if (modelId === 3) { // Airbus A380
      if (seatNumber >= 1 && seatNumber <= 399) return 'Economy';
      if (seatNumber >= 400 && seatNumber <= 475) return 'Business';
      if (seatNumber >= 476 && seatNumber <= 489) return 'Platinum';
    }
    return 'Economy'; // Default
  };

  // Handle seat selection with discount application
  const handleSeatSelect = (seatId) => {
    if (selectedPassengerIndex === null) {
      alert('Please select a passenger first.');
      return;
    }

    const selectedPassenger = passengerData[selectedPassengerIndex];
    const travelClass = getTravelClass(seatId);
    const originalPrice = seatPrices[travelClass] || 0;
    const discountedPrice = discount > 0 ? originalPrice * (1 - discount) : originalPrice;

    // Assign seat to passenger
    const updatedPassengerData = [...passengerData];
    const previousSeat = updatedPassengerData[selectedPassengerIndex].Seat;

    // If passenger had a previous seat, make it available again and adjust price
    if (previousSeat) {
      setSeatMap((prevSeats) =>
        prevSeats.map((seat) =>
          seat.seatId === previousSeat ? { ...seat, isAvailable: true } : seat
        )
      );

      const previousTravelClass = getTravelClass(previousSeat);
      const previousOriginalPrice = seatPrices[previousTravelClass] || 0;
      const previousDiscountedPrice = discount > 0 ? previousOriginalPrice * (1 - discount) : previousOriginalPrice;
      setTotalPrice((prevTotal) => prevTotal - previousDiscountedPrice);
    }

    updatedPassengerData[selectedPassengerIndex] = {
      ...updatedPassengerData[selectedPassengerIndex],
      Seat: seatId,
      price: discountedPrice,
      travelClass: travelClass,
      discountApplied: discount, // Store the discount applied
    };
    setPassengerData(updatedPassengerData);
    localStorage.setItem('PassengerData', JSON.stringify(updatedPassengerData));

    // Update seat map
    setSeatMap((prevSeats) =>
      prevSeats.map((seat) =>
        seat.seatId === seatId ? { ...seat, isAvailable: false } : seat
      )
    );

    // Update total price
    setTotalPrice((prevTotal) => prevTotal + discountedPrice);
  };

  const handleSubmit = async () => {
    // Validate all passengers have assigned seats
    for (let i = 0; i < passengerData.length; i++) {
      if (!passengerData[i].Seat) {
        alert(`Please assign a seat for ${passengerData[i].Name}.`);
        return;
      }
    }
  
    try {
      const flightId = localStorage.getItem('selectedFlightId');
      
      const bookingResponse = await fetch('/api/createBooking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flightId,
          userId: userId || '',
          passengerData,
          discount: discount, // Optionally send discount information
        }),
      });
  
      const bookingData = await bookingResponse.json();
  
      if (bookingResponse.status === 207) { // Partial success
        // Store successful bookings in BookingData
        const successfulBookings = bookingData.successfulBookings.map(booking => ({
          bookingId: booking.bookingId,
          passengerId: booking.Passenger_ID,
          passengerName: booking.Name,
          seat: booking.Seat,
          price: booking.price,
          travelClass: getTravelClass(booking.Seat)
        }));
        
        // Store existing bookings if any
        const existingBookings = JSON.parse(localStorage.getItem('BookingData') || '[]');
        localStorage.setItem('BookingData', JSON.stringify([...existingBookings, ...successfulBookings]));
  
        // Update PassengerData to keep only failed bookings, removing seat and price
        const remainingPassengers = passengerData.filter(passenger => 
          bookingData.failedBookings.some(failed => 
            failed.Passenger_ID === passenger.Passenger_ID
          )
        ).map(({ Seat, price, travelClass, discountApplied, ...rest }) => rest);
        localStorage.setItem('PassengerData', JSON.stringify(remainingPassengers));
  
        // Calculate new total price (which will be 0 as we removed prices)
        localStorage.setItem('TotalPrice', JSON.stringify(0));
  
        // Show error messages for failed bookings
        const errorMessages = bookingData.failedBookings
          .map(booking => booking.errorMessage)
          .join('\n');
        
        alert(`Some bookings failed:\n${errorMessages}`);
        
        // Refresh the page to update seat map
        window.location.reload();
        return;
      }
  
      if (!bookingResponse.ok) {
        throw new Error(bookingData.message || 'Failed to create bookings.');
      }
  
      // All bookings successful
      // Store all bookings in BookingData
      const successfulBookings = bookingData.successfulBookings.map(booking => ({
        bookingId: booking.bookingId,
        passengerId: booking.Passenger_ID,
        passengerName: booking.Name,
        seat: booking.Seat,
        price: booking.price,
        travelClass: getTravelClass(booking.Seat)
      }));
      
      // Store existing bookings if any
      const existingBookings = JSON.parse(localStorage.getItem('BookingData') || '[]');
      localStorage.setItem('BookingData', JSON.stringify([...existingBookings, ...successfulBookings]));
      
      // Clear PassengerData since all bookings were successful
      localStorage.setItem('PassengerData', JSON.stringify([]));
      
      // Store total price
      localStorage.setItem('TotalPrice', JSON.stringify(totalPrice));
      
      router.push('/tickets');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Something went wrong while creating bookings.');
    }
  };

  // Function to categorize seats by class
  const categorizeSeats = () => {
    const categorized = {
      Economy: [],
      Business: [],
      Platinum: []
    };

    seatMap.forEach(seat => {
      if (seat.isAisle) return; // Skip aisles

      const travelClass = getTravelClass(seat.seatId);
      categorized[travelClass].push(seat);
    });

    return categorized;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading seat map...</p>
      </div>
    );
  }

  const categorizedSeats = categorizeSeats();

  return (
    <div className="seat-selection-container">
      <h2>Select Your Seats</h2>

      {/* Passenger List */}
      <div className="passenger-list-section">
        <h3>Passengers</h3>
        <ul className="passenger-list">
          {passengerData.map((passenger, index) => (
            <li
              key={passenger.Passenger_ID || index}
              className={`passenger-item ${selectedPassengerIndex === index ? 'selected' : ''}`}
              onClick={() => handlePassengerSelect(index)}
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === 'Enter') handlePassengerSelect(index) }}
            >
              {passenger.Name} {passenger.Seat && `- Seat ${passenger.Seat}`}
            </li>
          ))}
        </ul>
      </div>

      {/* Seat Map */}
      <div className="seat-map-section">
        <h3>Seat Map</h3>
        {['Economy', 'Business', 'Platinum'].map(classType => (
          <div key={classType} className={`seat-class-section ${classType.toLowerCase()}`}>
            <h4>{classType} Class</h4>
            <div className="seat-map">
              {categorizedSeats[classType].map((seat) => (
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
                  onKeyPress={(e) => { if (e.key === 'Enter' && seat.isAvailable) handleSeatSelect(seat.seatId) }}
                >
                  {seat.seatId}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Discount Information */}
      {membershipType && discount > 0 && (
        <div className="discount-info-section">
          <h4>Membership: {membershipType}</h4>
          <p>Discount Applied: { (discount * 100).toFixed(0) }%</p>
        </div>
      )}

      {/* Total Price */}
      <div className="total-price-section">
        <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
        {membershipType && discount > 0 && (
          <p>Discount (Membership {membershipType}): -${(totalPrice * discount).toFixed(2)}</p>
        )}
      </div>

      <button onClick={handleSubmit} className="confirm-seats-button">
        Confirm Seats
      </button>
    </div>
  );
};

export default SeatSelection;