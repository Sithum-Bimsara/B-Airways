"use client";
import React, { useEffect, useState } from 'react';
import './Tickets.css';
import { useRouter } from 'next/navigation';

const Tickets = () => {
  const [bookings, setBookings] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [flightId, setFlightId] = useState('');
  const [loading, setLoading] = useState(true);
  const [originAirport, setOriginAirport] = useState('');
  const [destinationAirport, setDestinationAirport] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchTickets = async () => {
      const flightId = localStorage.getItem('selectedFlightId');
      const bookingData = JSON.parse(localStorage.getItem('BookingData')) || [];

      if (!flightId || bookingData.length === 0) {
        alert('No booking information found.');
        router.push('/searchResults');
        return;
      }

      setFlightId(flightId);
      setBookings(bookingData);
      setTotalPrice(bookingData.reduce((total, booking) => total + booking.price, 0));

      try {
        const response = await fetch(`/api/getFlightDetails?flightId=${flightId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch flight details.');
        }

        const { flight } = await response.json();
        setOriginAirport(flight.originAirport);
        setDestinationAirport(flight.destinationAirport);
        setDepartureDate(flight.departureDate);
        setArrivalDate(flight.arrivalDate);
      } catch (error) {
        console.error(error);
        alert(error.message || 'Error fetching flight details.');
      }

      setLoading(false);
    };

    fetchTickets();
  }, [router]);

  const handleBookReturnFlight = () => {
    const lastSearchUrl = localStorage.getItem('lastSearchUrl');
    if (lastSearchUrl) {
      router.push(lastSearchUrl);
    } else {
      router.push('/searchResults?route1=RT003&departureDate=2024-10-28');
    }
  };

  const handleReturnHome = () => {
    router.push('/');
  };

  if (loading) {
    return <p className="loading">Loading your tickets...</p>;
  }
  return (
    <div className="tickets-container">
      <h2 className="title">Your Tickets</h2>
      
      <div className="tickets-list">
        {bookings.map((booking) => (
          <div key={booking.bookingId} className="boarding-pass">
            <div className="main-ticket">
              <div className="ticket-header">
                <h3>BOARDING PASS</h3>
                <span className="airline">B AIRWAYS</span>
              </div>
              
              <div className="ticket-body">
                <div className="ticket-row">
                  <div className="ticket-field">
                    <label>PASSENGER NAME</label>
                    <p>{booking.passengerName}</p>
                  </div>
                  <div className="ticket-field">
                    <label>FLIGHT DATE</label>
                    <p>{new Date(departureDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="ticket-row">
                  <div className="ticket-field">
                    <label>FROM</label>
                    <p>{originAirport}</p>
                  </div>
                  <div className="ticket-field">
                    <label>TO</label>
                    <p>{destinationAirport}</p>
                  </div>
                </div>
              </div>

              <div className="ticket-footer">
                <div className="airline-logo">
                  <span>B AIRWAYS</span>
                  <div className="plane-icon">✈</div>
                </div>
              </div>
            </div>

            <div className="ticket-stub">
              <div className="stub-content">
                <p className="flight-date">{new Date(departureDate).toLocaleDateString()}</p>
                <p className="from">{originAirport}</p>
                <p className="to">{destinationAirport}</p>
                <p className="class">{booking.travelClass}</p>
                <p className="price">${booking.price.toFixed(2)}</p>
                <div className="barcode">
                  {/* Barcode representation */}
                  ||||| |||| ||||| ||||
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="total-section">
        <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
      </div>

      <div className="button-container">
        <button className="action-button" onClick={handleBookReturnFlight}>
          Book a Return Flight
        </button>
        <button className="action-button" onClick={handleReturnHome}>
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default Tickets;