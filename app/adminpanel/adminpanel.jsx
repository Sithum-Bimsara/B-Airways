"use client";
import React, { useState, useEffect, useContext } from 'react';
import './adminpanel.css';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { role } = useContext(AuthContext);
  const router = useRouter();

  const [passengerDetails, setPassengerDetails] = useState({ below18: [], above18: [] });
  const [passengerCount, setPassengerCount] = useState(0);
  const [bookingCounts, setBookingCounts] = useState([]);
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

  const [activeTab, setActiveTab] = useState('passengerDetails');

  useEffect(() => {
    if (role !== 'Admin') {
      router.push('/');
    }
  }, [role, router]);

  // Fetch Functions
  const fetchPassengerDetails = async (flightNo) => {
    try {
      const response = await fetch(`/api/passengers?flightNo=${flightNo}`);
      const data = await response.json();
      setPassengerDetails({
        below18: data.below18.map(p => ({
          id: p.id,
          name: p.name,
          age: p.age,
          gender: p.gender,
          ageCategory: p.ageCategory
        })),
        above18: data.above18.map(p => ({
          id: p.id,
          name: p.name,
          age: p.age,
          gender: p.gender,
          ageCategory: p.ageCategory
        }))
      });
    } catch (error) {
      console.error("Error fetching passenger details:", error);
    }
  };

  const fetchPassengerCount = async (destination, fromDate, toDate) => {
    try {
      const response = await fetch(`/api/passenger-count?destination=${destination}&fromDate=${fromDate}&toDate=${toDate}`);
      const data = await response.json();
      setPassengerCount(data.count);
    } catch (error) {
      console.error("Error fetching passenger count:", error);
    }
  };

  const fetchBookingCounts = async (fromDate, toDate) => {
    try {
      const response = await fetch(`/api/bookings?fromDate=${fromDate}&toDate=${toDate}`);
      const data = await response.json();
      setBookingCounts(data.bookingCounts);
    } catch (error) {
      console.error("Error fetching booking counts:", error);
    }
  };

  const fetchPastFlights = async (origin, destination) => {
    try {
      const response = await fetch(`/api/past-flights?origin=${origin}&destination=${destination}`);
      const data = await response.json();
      setPastFlights(data.pastFlights);
    } catch (error) {
      console.error("Error fetching past flights:", error);
    }
  };

  const fetchRevenueData = async () => {
    try {
      const response = await fetch('/api/revenue');
      const data = await response.json();
      setRevenueData(data);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const renderPassengerDetails = () => (
    <div className="card">
      <div className="card-header">Passengers by Age</div>
      <div className="card-body">
        <form onSubmit={(e) => { e.preventDefault(); fetchPassengerDetails(formData.flightNo); }}>
          <div className="form-group">
            <label>Flight Number:</label>
            <input type="text" name="flightNo" value={formData.flightNo} onChange={handleInputChange} required />
          </div>
          <button type="submit">Submit</button>
        </form>
        <div className="tables-container">
          <div className="table-wrapper">
            <h3>Below 18</h3>
            <table>
              <thead>
                <tr><th>Name</th><th>Age</th><th>Gender</th></tr>
              </thead>
              <tbody>
                {passengerDetails.below18.map((p) => <tr key={p.id}><td>{p.name}</td><td>{p.age}</td><td>{p.gender}</td></tr>)}
              </tbody>
            </table>
          </div>
          <div className="table-wrapper">
            <h3>Above 18</h3>
            <table>
              <thead>
                <tr><th>Name</th><th>Age</th><th>Gender</th></tr>
              </thead>
              <tbody>
                {passengerDetails.above18.map((p) => <tr key={p.id}><td>{p.name}</td><td>{p.age}</td><td>{p.gender}</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPassengerCount = () => (
    <div className="card">
      <div className="card-header">Passenger Count by Destination</div>
      <div className="card-body">
        <form onSubmit={(e) => { e.preventDefault(); fetchPassengerCount(formData.destination, formData.fromDate, formData.toDate); }}>
          <div className="form-group">
            <label>Destination:</label>
            <input type="text" name="destination" value={formData.destination} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>From Date:</label>
            <input type="date" name="fromDate" value={formData.fromDate} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>To Date:</label>
            <input type="date" name="toDate" value={formData.toDate} onChange={handleInputChange} required />
          </div>
          <button type="submit">Submit</button>
        </form>
        <p className="count-display">Total Passengers: {passengerCount}</p>
      </div>
    </div>
  );

  const renderBookingCounts = () => (
    <div className="card">
      <div className="card-header">Booking Counts by Passenger Type</div>
      <div className="card-body">
        <form onSubmit={(e) => { e.preventDefault(); fetchBookingCounts(formData.fromDate, formData.toDate); }}>
          <div className="form-group">
            <label>From Date:</label>
            <input type="date" name="fromDate" value={formData.fromDate} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>To Date:</label>
            <input type="date" name="toDate" value={formData.toDate} onChange={handleInputChange} required />
          </div>
          <button type="submit">Submit</button>
        </form>
        <div className="booking-counts">
          {bookingCounts.length > 0 ? (
            <table>
              <thead>
                <tr><th>Passenger Type</th><th>Number of Bookings</th></tr>
              </thead>
              <tbody>
                {bookingCounts.map((booking, index) => (
                  <tr key={index}>
                    <td>{booking.PassengerType}</td>
                    <td>{booking.NumberOfBookings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p>No data available.</p>}
        </div>
      </div>
    </div>
  );

  const renderPastFlights = () => (
    <div className="card">
      <div className="card-header">Past Flights Data</div>
      <div className="card-body">
        <form onSubmit={(e) => { e.preventDefault(); fetchPastFlights(formData.origin, formData.destinationQuery); }}>
          <div className="form-group">
            <label>Origin:</label>
            <input type="text" name="origin" value={formData.origin} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Destination:</label>
            <input type="text" name="destinationQuery" value={formData.destinationQuery} onChange={handleInputChange} required />
          </div>
          <button type="submit">Submit</button>
        </form>
        <div className="flight-list">
          {pastFlights.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Flight ID</th>
                  <th>Origin Airport</th>
                  <th>Destination Airport</th>
                  <th>Status</th>
                  <th>Passenger Count</th>
                </tr>
              </thead>
              <tbody>
                {pastFlights.map((flight) => (
                  <tr key={flight.Flight_ID}>
                    <td>{flight.Flight_ID}</td>
                    <td>{flight.OriginAirportName}</td>
                    <td>{flight.DestinationAirportName}</td>
                    <td>{flight.Status}</td>
                    <td>{flight.PassengerCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p>No past flights found.</p>}
        </div>
      </div>
    </div>
  );

  const renderRevenueData = () => (
    <div className="card">
      <div className="card-header">Revenue by Aircraft Type</div>
      <div className="card-body">
        {revenueData.length > 0 ? (
          <div className="chart-container">
            <table>
              <thead><tr><th>Aircraft</th><th>Revenue</th></tr></thead>
              <tbody>
                {revenueData.map((r) => <tr key={r.model}><td>{r.model}</td><td>${r.revenue.toLocaleString()}</td></tr>)}
              </tbody>
            </table>
            {/* Placeholder for chart */}
            {/* You can integrate a chart library like Chart.js or Recharts for better visualization */}
          </div>
        ) : <p>Loading revenue data...</p>}
      </div>
    </div>
  );

  if (role !== 'Admin') {
    return null; // Or you could return a "Not Authorized" message
  }

  return (
    <div className="container">
      <h1>Airline Admin Dashboard</h1>
      <div className="tabs">
        <button className={activeTab === 'passengerDetails' ? 'active' : ''} onClick={() => setActiveTab('passengerDetails')}>Passenger Details</button>
        <button className={activeTab === 'passengerCount' ? 'active' : ''} onClick={() => setActiveTab('passengerCount')}>Passenger Count</button>
        <button className={activeTab === 'bookingCounts' ? 'active' : ''} onClick={() => setActiveTab('bookingCounts')}>Booking Counts</button>
        <button className={activeTab === 'pastFlights' ? 'active' : ''} onClick={() => setActiveTab('pastFlights')}>Past Flights</button>
        <button className={activeTab === 'revenueData' ? 'active' : ''} onClick={() => setActiveTab('revenueData')}>Revenue Data</button>
      </div>
      <div className="content">
        {activeTab === 'passengerDetails' && renderPassengerDetails()}
        {activeTab === 'passengerCount' && renderPassengerCount()}
        {activeTab === 'bookingCounts' && renderBookingCounts()}
        {activeTab === 'pastFlights' && renderPastFlights()}
        {activeTab === 'revenueData' && renderRevenueData()}
      </div>
    </div>
  );
}