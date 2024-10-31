"use client";
import React, { useEffect, useState, useRef } from 'react';
import './Tickets.css';
import { useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';
import Toast from '../components/Toast/Toast';

const Tickets = () => {
  const [bookings, setBookings] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [flightId, setFlightId] = useState('');
  const [loading, setLoading] = useState(true);
  const [originAirport, setOriginAirport] = useState('');
  const [destinationAirport, setDestinationAirport] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [flightType, setFlightType] = useState('');
  const router = useRouter();
  const ticketsRef = useRef(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  useEffect(() => {
    const fetchTickets = async () => {
      const flightId = localStorage.getItem('selectedFlightId');
      const bookingData = JSON.parse(localStorage.getItem('BookingData')) || [];
      const flightTypeFromStorage = localStorage.getItem('flightType');

      if (!flightId || bookingData.length === 0) {
        showToast('No booking information found.', 'error');
        router.push('/searchResults');
        return;
      }

      setFlightId(flightId);
      setBookings(bookingData);
      setFlightType(flightTypeFromStorage);
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
        showToast(error.message || 'Error fetching flight details.', 'error');
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

  const handleSendEmail = async () => {
    if (!bookings.length) {
      showToast('No bookings to send.', 'error');
      return;
    }

    try {
      const ticketsElement = ticketsRef.current;
      if (!ticketsElement) {
        showToast('Could not find tickets element.', 'error');
        return;
      }

      showToast('Preparing your tickets...', 'info');
      const canvas = await html2canvas(ticketsElement);
      const imageData = canvas.toDataURL('image/png');

      const firstBookingId = bookings[0].bookingId;
      if (!firstBookingId) {
        showToast('No Booking ID found.', 'error');
        return;
      }

      const emailResponse = await fetch('/api/getUserEmailByBookingId', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId: firstBookingId }),
      });

      const emailData = await emailResponse.json();

      if (!emailResponse.ok) {
        showToast(`Failed to retrieve user email: ${emailData.message}`, 'error');
        return;
      }

      const userEmail = emailData.email;
      if (!userEmail) {
        showToast('User email not found. Please log in again.', 'error');
        return;
      }

      showToast('Sending email...', 'info');
      const response = await fetch('/api/sendTicketEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, image: imageData }),
      });

      const data = await response.json();
      if (response.ok) {
        showToast('Ticket image sent to your email successfully.', 'success');
      } else {
        showToast(`Failed to send email: ${data.message}`, 'error');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      showToast('An error occurred while sending the email.', 'error');
    }
  };

  if (loading) {
    return <p className="loading">Loading your tickets...</p>;
  }
  return (
    <div className="tickets-container">
      <h2 className="title">Your Tickets</h2>
      
      <div className="tickets-list" ref={ticketsRef}>
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
                  ||||| |||| ||||| 
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="total-section">
        <h2>Total Price: ${totalPrice.toFixed(2)}</h2>
      </div>

      <div className="button-container">
        {flightType === 'roundtrip' && (
          <button className="action-button" onClick={handleBookReturnFlight}>
            Book a Return Flight
          </button>
        )}
        <button className="action-button" onClick={handleReturnHome}>
          Return to Home
        </button>
        <button className="action-button" onClick={handleSendEmail}>
          Send Ticket via Email
        </button>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </div>
  );
};

export default Tickets;