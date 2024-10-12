"use client"; // Ensure this is marked as a client component

import React, { useState } from 'react';
import './TripSummary.css'; // Ensure your CSS file is properly linked

const TripSummary = () => {
  const [showConditions, setShowConditions] = useState(false);
  const [showRefundConditions, setShowRefundConditions] = useState(false);

  const toggleConditions = () => {
    setShowConditions(!showConditions);
  };

  const toggleRefundConditions = () => {
    setShowRefundConditions(!showRefundConditions);
  };

  return (
    <div className="trip-summary-container">
      {/* Trip summary section */}
      <div className="trip-summary-header">
        <h2>Trip Summary</h2>
        <h3>Colombo &gt; Doha Fri, 11 Oct 2024</h3>
      </div>

      {/* Flight details */}
      <div className="flight-details">
        <div className="flight-info">
          <p><strong>Departure</strong></p>
          <p><strong>20:20 CMB</strong></p>
          <p>Colombo, Bandaranaike International Airport</p>
          <p>Sri Lanka</p>
        </div>

        

        <div className="flight-info">
          <p><strong>Arrival</strong></p>
          <p><strong>22:50 DOH</strong></p>
          <p>Doha, Hamad International Airport</p>
          <p>Qatar</p>
        </div>

        {/* Baggage and Class Info inline */}
        <div className="baggage-info">
          <p><strong>Class / Checked baggage allowance</strong></p>
          <p><strong>Economy (H)</strong></p>
          <p>Adult: 35 kg</p>
          <p>Child: 35 kg</p>
        </div>
      </div>

      {/* Passenger details */}
      <h4>Passenger Details</h4>
      <table className="passenger-details">
        <thead>
          <tr>
            <th>Passenger Name</th>
            <th>Passport</th>
            <th>Date of Birth</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mrs Sanuji Perera</td>
            <td>200280703718</td>
            <td>01 Feb 1990</td>
            <td>Adult</td>
          </tr>
          <tr>
            <td>Miss Minuli Perera</td>
            <td>200680703718</td>
            <td>04 Apr 2014</td>
            <td>Child</td>
          </tr>
        </tbody>
      </table>

      {/* Contact details */}
      <h4>Contact Details</h4>
      <table className="contact-details">
        <thead>
          <tr>
            <th>Passenger Name</th>
            <th>Type</th>
            <th>Email</th>
            <th>Number</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mrs Sanuji Perera</td>
            <td>Frequent</td>
            <td>sanujis1102@gmail.com</td>
            <td>94-774194482</td>
          </tr>
        </tbody>
      </table>

      {/* Seat details */}
      <h4>Seat Details</h4>
      <table className="seat-details">
        <thead>
          <tr>
            <th>Passenger Name</th>
            <th>Seat Number</th>
          </tr>
        </thead>
        <tbody>
          {['Sanuji Perera', 'Minuli Perera'].map((name, index) => (
            <tr key={index}>
              <td>{name}</td>{/* Assign seats based on index or any other logic */}
              {index === 0 ? (
                <td>21D</td>) : (
                <td>21E</td>)}
            </tr>)
          )}
        </tbody>
      </table>

      {/* Dropdown for Purchase Conditions */}
      <>
        {/* Heading for Purchase Conditions */}
        <div className="conditions"><h4 onClick={toggleConditions} style={{ cursor: 'pointer' }}>
          Purchase Conditions {showConditions ? '▲' : '▼'}
        </h4></div>

        {showConditions && (
          <>
            {/* Content for Purchase Conditions */}
            {/* Example content */}
            <div className="conditions-content">
  <ul>
    <li>Arrive at least three hours before your flight. There may be delays at the airport due to extra check-in procedures. Ensure you have plenty of time to check-in safely and make your way to your gate.</li>
    <li>For more information on baggage rules and restrictions on Qatar Airways flights, please <a href="#">click here</a>.</li>
    <li>Baggage allowance may differ for flights operated by another carrier. Please <a href="#">click here</a> for more details.</li>
    <li>Should you wish to change your booking, and the originally purchased fare or booking class is not available for your new flights, a difference of fare will be collected on top of the change fee if the rule permits changes.</li>
    <li>If you have a stopover in Doha, please <a href="#">click here</a> for more information.</li>
    <li>An additional administrative/service fee for rebooking/cancellation may apply.</li>
    <li>When a ticket is booked with a combination of fares, the most restrictive cancellation rule will apply.</li>
    <li>Fares are not guaranteed until full payment is received and tickets are issued.</li>
    <li>Where applicable, local airport taxes will be collected at the time of check-in.</li>
    <li>Additional card transaction fees may apply and are dependent on the card issuer.</li>
    <li>You should carry a copy of this booking confirmation while you travel as it may be required for immigration purposes.</li>
  </ul>
</div>
          </>
        )}
      </>
      
      {/* Dropdown for Refund Conditions */}
      <>
        {/* Heading for Refund Conditions */}
        <div className="conditions"><h4 onClick={toggleRefundConditions} style={{ cursor: 'pointer' }}>
          Refund Conditions {showRefundConditions ? '▲' : '▼'}
        </h4></div>

        {showRefundConditions && (
          <>
            {/* Content for Refund Conditions */}
            {/* Adult Refund Conditions */}
            <div className="conditions-content">
              {/* Example content for Adult Refund Conditions */}
              <p><strong>No-show for first flight</strong></p>
              <li>Refund allowed with restrictions. Penalty fee between: 15100 LKR / 15100 LKR.</li><br />
              <li>Maximum refund penalty fee for entire ticket: 15100 LKR.</li><br />
              <p><strong>No-show for subsequent flights</strong></p>
              <li>Refund not allowed.</li><br />
              <p><strong>Prior to departure of first flight</strong></p>
              <li>Refund allowed with restrictions. Penalty fee between: 0 LKR / 15100 LKR.</li><br />
              <li>Maximum refund penalty fee for entire ticket: 15100 LKR.</li><br />
              <p><strong>After departure of first flight:</strong></p>
              <li>Refund not allowed.</li><br />
            </div>
            
          </>
        )}
      </>

      <div class="price-summary">
    <h3>Total price : LKR 451,004.00 </h3>
  </div>

  {/* Pay Now button */}
  <div className="pay-now-button">
        <button onClick={() => alert('Proceed to payment')} className="pay-button">
          Purchase
        </button>
      </div>

    </div >
  );
}

export default TripSummary;