"use client";
import React, { useState, useEffect } from 'react';
import './adminpanel.css';

export default function AdminDashboard() {
  const [passengerDetails, setPassengerDetails] = useState({ below18: [], above18: [] });
  const [passengerCount, setPassengerCount] = useState(0);
  const [bookingCounts, setBookingCounts] = useState({});
  const [pastFlights, setPastFlights] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  const [formData, setFormData] = useState({
    flightNo: '',
    destination: '',
    fromDate: '',
    toDate: '',
    origin: '',
    destinationQuery: ''
  });

  // Fetch Functions
  const fetchPassengerDetails = async (flightNo) => {
    const response = await fetch(`/api/passengers?flightNo=${flightNo}`);
    const data = await response.json();
    setPassengerDetails(data);
  };

  const fetchPassengerCount = async (destination, fromDate, toDate) => {
    const response = await fetch(`/api/passenger-count?destination=${destination}&fromDate=${fromDate}&toDate=${toDate}`);
    const data = await response.json();
    setPassengerCount(data.count);
  };

  const fetchBookingCounts = async (fromDate, toDate) => {
    const response = await fetch(`/api/bookings?fromDate=${fromDate}&toDate=${toDate}`);
    const data = await response.json();
    setBookingCounts(data);
  };

  const fetchPastFlights = async (origin, destination) => {
    const response = await fetch(`/api/past-flights?origin=${origin}&destination=${destination}`);
    const data = await response.json();
    setPastFlights(data);
  };

  const fetchRevenueData = async () => {
    const response = await fetch('/api/revenue');
    const data = await response.json();
    setRevenueData(data);
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container">
      <h1>Airline Admin Dashboard</h1>

      {/* Report 1: Passenger Details by Age */}
      <div className="card">
        <div className="card-header">Passengers by Age</div>
        <div className="card-body">
          <form onSubmit={(e) => { e.preventDefault(); fetchPassengerDetails(formData.flightNo); }}>
            <div className="form-group">
              <label>Flight Number:</label>
              <input type="text" name="flightNo" value={formData.flightNo} onChange={handleInputChange} />
            </div>
            <button type="submit">Submit</button>
          </form>
          <h3>Below 18</h3>
          <table>
            <thead>
              <tr><th>Name</th><th>Age</th></tr>
            </thead>
            <tbody>
              {passengerDetails.below18.map((p) => <tr key={p.id}><td>{p.name}</td><td>{p.age}</td></tr>)}
            </tbody>
          </table>
          <h3>Above 18</h3>
          <table>
            <thead>
              <tr><th>Name</th><th>Age</th></tr>
            </thead>
            <tbody>
              {passengerDetails.above18.map((p) => <tr key={p.id}><td>{p.name}</td><td>{p.age}</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report 2: Passenger Count */}
      <div className="card">
        <div className="card-header">Passenger Count by Destination</div>
        <div className="card-body">
          <form onSubmit={(e) => { e.preventDefault(); fetchPassengerCount(formData.destination, formData.fromDate, formData.toDate); }}>
            <div className="form-group">
              <label>Destination:</label>
              <input type="text" name="destination" value={formData.destination} onChange={handleInputChange} />
            </div>
            <button type="submit">Submit</button>
          </form>
          <p>Total Passengers: {passengerCount}</p>
        </div>
      </div>

      {/* Report 3: Booking Counts */}
      <div className="card">
        <div className="card-header">Booking Counts by Passenger Type</div>
        <div className="card-body">
          <form onSubmit={(e) => { e.preventDefault(); fetchBookingCounts(formData.fromDate, formData.toDate); }}>
            <div className="form-group">
              <label>From Date:</label>
              <input type="date" name="fromDate" value={formData.fromDate} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>To Date:</label>
              <input type="date" name="toDate" value={formData.toDate} onChange={handleInputChange} />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

      {/* Report 4: Past Flights */}
      <div className="card">
        <div className="card-header">Past Flights Data</div>
        <div className="card-body">
          <form onSubmit={(e) => { e.preventDefault(); fetchPastFlights(formData.origin, formData.destinationQuery); }}>
            <div className="form-group">
              <label>Origin:</label>
              <input type="text" name="origin" value={formData.origin} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Destination:</label>
              <input type="text" name="destinationQuery" value={formData.destinationQuery} onChange={handleInputChange} />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

      {/* Report 5: Revenue by Aircraft Type */}
      <div className="card">
        <div className="card-header">Revenue by Aircraft Type</div>
        <div className="card-body">
          <table>
            <thead><tr><th>Aircraft</th><th>Revenue</th></tr></thead>
            <tbody>
              {revenueData.map((r) => <tr key={r.model}><td>{r.model}</td><td>{r.revenue}</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
