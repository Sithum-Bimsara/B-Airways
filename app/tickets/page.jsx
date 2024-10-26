// "use client";
// import React, { useEffect, useState } from 'react';
// import './Tickets.css';
// import { useRouter } from 'next/navigation';

// const Tickets = () => {
//   const [bookings, setBookings] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [flightId, setFlightId] = useState('');
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchTickets = () => {
//       const flightId = localStorage.getItem('selectedFlightId');
//       const passengerData = JSON.parse(localStorage.getItem('PassengerData')) || [];
//       const totalPrice = JSON.parse(localStorage.getItem('TotalPrice')) || 0;

//       if (!flightId || passengerData.length === 0) {
//         alert('No booking information found.');
//         router.push('/searchResults');
//         return;
//       }

//       setFlightId(flightId);
//       setBookings(passengerData);
//       setTotalPrice(totalPrice);
//       setLoading(false);
//     };

//     fetchTickets();
//   }, [router]);

//   if (loading) {
//     return <p>Loading your tickets...</p>;
//   }

//   return (
//     <div className="tickets-container">
//       <h2>Your Tickets</h2>
//       <p><strong>Flight ID:</strong> {flightId}</p>
//       <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>

//       <div className="tickets-list">
//         {bookings.map((booking) => (
//           <div key={booking.Passenger_ID} className="ticket-item">
//             <h3>Passenger {parseInt(booking.Passenger_ID, 10)}</h3>
//             <p><strong>Seat:</strong> {booking.Seat}</p>
//             <p><strong>Price:</strong> ${booking.price.toFixed(2)}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Tickets;