import React from 'react';
import './FlightTicket.css';

const FlightTicket = () => {
  return (
    <div className="ticket-container">
      <div className="ticket">
        <div className="ticket-left">
          <div className="airline-name">B AIRWAYS</div>
          
        </div>

        <div className="ticket-middle">
          <div className="passenger-info">
            <p>Passenger</p>
            <h3>Sanuji Samarakoon</h3>
          </div>
          <div className="ticket-details">
            <div className="detail">
              <p>Boarding Time</p>
              <h4>09.00 AM</h4>
            </div>
            <div className="detail">
              <p>Gate</p>
              <h4>12</h4>
            </div>
            <div className="detail">
              <p>Flight</p>
              <h4>A001</h4>
            </div>
            <div className="detail">
              <p>Date</p>
              <h4>15.12.2025</h4>
            </div>
            <div className="detail">
              <p>From</p>
              <h4>Sri Lanka</h4>
            </div>
            <div className="detail">
              <p>To</p>
              <h4>Newyork City</h4>
            </div>
            <div className="detail">
              <p>Seat</p>
              <h4>12</h4>
            </div>
            <div className="detail">
              <p>Group</p>
              <h4>D</h4>
            </div>
          </div>
        </div>

        <div className="ticket-right">
          <h2>ECONOMY CLASS</h2>
          <div className="plane-icon">✈</div>
          <p className="boarding-instruction">
            Please watch the departure board for the boarding & gate update. Boarding ends 15 min before departure.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlightTicket;
