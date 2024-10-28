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
  const [flights, setFlights] = useState([]);

  const [formData, setFormData] = useState({
    flightNo: '',
    destination: '',
    fromDate: '',
    toDate: '',
    origin: '',
    destinationQuery: ''
  });

  const [addFlightData, setAddFlightData] = useState({
    Airplane_ID: '',
    Route_ID: '',
    Departure_date: '',
    Arrival_date: '',
    Departure_time: '',
    Arrival_time: '',
    Economy_Price: '',
    Business_Price: '',
    Platinum_Price: ''
  });

  const [changeStatusData, setChangeStatusData] = useState({
    Flight_ID: '',
    newStatus: ''
  });

  const [activeTab, setActiveTab] = useState('passengerDetails');
  const [addFlightStatus, setAddFlightStatus] = useState({ loading: false, message: '' });
  const [changeStatus, setChangeStatus] = useState({ loading: false, message: '' });

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

  const fetchAllFlights = async () => {
    try {
      const response = await fetch('/api/getAllFlights');
      const data = await response.json();
      if (data && Array.isArray(data)) {
        setFlights(data);
      } else if (data && data.flights && Array.isArray(data.flights)) {
        setFlights(data.flights);
      } else {
        console.error("Invalid flight data format received");
        setFlights([]);
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
      setFlights([]);
    }
  };

  useEffect(() => {
    fetchRevenueData();
    fetchAllFlights();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddFlightChange = (e) => {
    const { name, value } = e.target;
    setAddFlightData({ ...addFlightData, [name]: value });
  };

  const handleChangeStatusInput = (e) => {
    const { name, value } = e.target;
    setChangeStatusData({ ...changeStatusData, [name]: value });
  };

  const handleAddFlightSubmit = async (e) => {
    e.preventDefault();
    setAddFlightStatus({ loading: true, message: '' });

    try {
      const response = await fetch('/api/addFlight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addFlightData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add flight.');
      }

      setAddFlightStatus({ loading: false, message: 'Flight added successfully!' });
      // Reset the form
      setAddFlightData({
        Airplane_ID: '',
        Route_ID: '',
        Departure_date: '',
        Arrival_date: '',
        Departure_time: '',
        Arrival_time: '',
        Economy_Price: '',
        Business_Price: '',
        Platinum_Price: ''
      });
      // Refresh the flights list
      fetchAllFlights();
    } catch (error) {
      console.error(error);
      setAddFlightStatus({ loading: false, message: error.message || 'Something went wrong.' });
    }
  };

  const handleChangeStatusSubmit = async (e) => {
    e.preventDefault();
    setChangeStatus({ loading: true, message: '' });

    try {
      const response = await fetch('/api/changeFlightStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(changeStatusData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to change flight status.');
      }

      setChangeStatus({ loading: false, message: 'Flight status updated successfully!' });
      // Reset the form
      setChangeStatusData({
        Flight_ID: '',
        newStatus: ''
      });
      // Refresh the flights list
      fetchAllFlights();
    } catch (error) {
      console.error(error);
      setChangeStatus({ loading: false, message: error.message || 'Something went wrong.' });
    }
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

  const renderAddFlight = () => (
    <div className="card">
      <div className="card-header">Add New Flight</div>
      <div className="card-body">
        <form onSubmit={handleAddFlightSubmit}>
          <div className="form-group">
            <label>Airplane ID:</label>
            <input
              type="number"
              name="Airplane_ID"
              value={addFlightData.Airplane_ID}
              onChange={handleAddFlightChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Route ID:</label>
            <input
              type="text"
              name="Route_ID"
              value={addFlightData.Route_ID}
              onChange={handleAddFlightChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Departure Date:</label>
            <input
              type="date"
              name="Departure_date"
              value={addFlightData.Departure_date}
              onChange={handleAddFlightChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Arrival Date:</label>
            <input
              type="date"
              name="Arrival_date"
              value={addFlightData.Arrival_date}
              onChange={handleAddFlightChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Departure Time:</label>
            <input
              type="time"
              name="Departure_time"
              value={addFlightData.Departure_time}
              onChange={handleAddFlightChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Arrival Time:</label>
            <input
              type="time"
              name="Arrival_time"
              value={addFlightData.Arrival_time}
              onChange={handleAddFlightChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Economy Price:</label>
            <input
              type="number"
              name="Economy_Price"
              value={addFlightData.Economy_Price}
              onChange={handleAddFlightChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>Business Price:</label>
            <input
              type="number"
              name="Business_Price"
              value={addFlightData.Business_Price}
              onChange={handleAddFlightChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>Platinum Price:</label>
            <input
              type="number"
              name="Platinum_Price"
              value={addFlightData.Platinum_Price}
              onChange={handleAddFlightChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <button type="submit" disabled={addFlightStatus.loading}>
            {addFlightStatus.loading ? 'Adding Flight...' : 'Add Flight'}
          </button>
        </form>
        {addFlightStatus.message && (
          <p className={`add-flight-message ${addFlightStatus.message.includes('successfully') ? 'success' : 'error'}`}>
            {addFlightStatus.message}
          </p>
        )}
      </div>
    </div>
  );

  const renderChangeFlightStatus = () => (
    <div className="card">
      <div className="card-header">Change Flight Status</div>
      <div className="card-body">
        <form onSubmit={handleChangeStatusSubmit}>
          <div className="form-group">
            <label>Flight ID:</label>
            <select
              name="Flight_ID"
              value={changeStatusData.Flight_ID}
              onChange={handleChangeStatusInput}
              required
            >
              <option value="" disabled>Select a flight</option>
              {flights && flights.length > 0 ? (
                flights.map((flight) => (
                  <option key={flight.Flight_ID} value={flight.Flight_ID}>
                    {`Flight ${flight.Flight_ID}`}
                  </option>
                ))
              ) : (
                <option value="" disabled>No flights available</option>
              )}
            </select>
          </div>
          <div className="form-group">
            <label>New Status:</label>
            <select
              name="newStatus"
              value={changeStatusData.newStatus}
              onChange={handleChangeStatusInput}
              required
            >
              <option value="" disabled>Select new status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Delayed">Delayed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <button type="submit" disabled={changeStatus.loading}>
            {changeStatus.loading ? 'Updating Status...' : 'Update Status'}
          </button>
        </form>
        {changeStatus.message && (
          <p className={`change-status-message ${changeStatus.message.includes('successfully') ? 'success' : 'error'}`}>
            {changeStatus.message}
          </p>
        )}
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
        <button className={activeTab === 'addFlight' ? 'active' : ''} onClick={() => setActiveTab('addFlight')}>Add Flight</button>
        <button className={activeTab === 'changeFlightStatus' ? 'active' : ''} onClick={() => setActiveTab('changeFlightStatus')}>Change Flight Status</button>
      </div>
      <div className="content">
        {activeTab === 'passengerDetails' && renderPassengerDetails()}
        {activeTab === 'passengerCount' && renderPassengerCount()}
        {activeTab === 'bookingCounts' && renderBookingCounts()}
        {activeTab === 'pastFlights' && renderPastFlights()}
        {activeTab === 'revenueData' && renderRevenueData()}
        {activeTab === 'addFlight' && renderAddFlight()}
        {activeTab === 'changeFlightStatus' && renderChangeFlightStatus()}
      </div>
    </div>
  );
}