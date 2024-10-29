"use client";
import React, { useState, useEffect, useContext } from 'react';
import styles from './adminpanel.module.css';
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddFlightChange = (e) => {
    const { name, value } = e.target;
    setAddFlightData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangeStatusInput = (e) => {
    const { name, value } = e.target;
    setChangeStatusData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  // Event Handlers
  const handleAddFlightSubmit = async (e) => {
    e.preventDefault();
    setAddFlightStatus({ loading: true, message: '' });
    try {
      const response = await fetch('/api/addFlight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addFlightData)
      });
      const result = await response.json();
      if (response.ok) {
        setAddFlightStatus({ loading: false, message: 'Flight added successfully.' });
        // Optionally, reset form
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
        fetchAllFlights(); // Refresh flights list
      } else {
        throw new Error(result.message || 'Failed to add flight.');
      }
    } catch (error) {
      setAddFlightStatus({ loading: false, message: `Error: ${error.message}` });
    }
  };

  const handleChangeStatusSubmit = async (e) => {
    e.preventDefault();
    setChangeStatus({ loading: true, message: '' });
    try {
      const response = await fetch('/api/changeFlightStatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changeStatusData)
      });
      const result = await response.json();
      if (response.ok) {
        setChangeStatus({ loading: false, message: 'Flight status updated successfully.' });
        // Optionally, reset form
        setChangeStatusData({
          Flight_ID: '',
          newStatus: ''
        });
        fetchAllFlights(); // Refresh flights list
      } else {
        throw new Error(result.message || 'Failed to update flight status.');
      }
    } catch (error) {
      setChangeStatus({ loading: false, message: `Error: ${error.message}` });
    }
  };

  // Render Functions
  const renderPassengerDetails = () => (
    <div className={styles.card}>
      <div className={styles.cardHeader}>Passengers by Age</div>
      <div className={styles.cardBody}>
        <form onSubmit={(e) => { e.preventDefault(); fetchPassengerDetails(formData.flightNo); }} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Flight Number:</label>
            <input
              type="text"
              name="flightNo"
              value={formData.flightNo}
              onChange={handleInputChange}
              required
              className={styles.input}
              placeholder="Enter Flight Number"
            />
          </div>
          <button type="submit" className={`${styles.button} ${styles.primaryButton}`}>
            Submit
          </button>
        </form>
        <div className={styles.tablesContainer}>
          <div className={styles.tableWrapper}>
            <h3 className={styles.tableTitle}>Below 18</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.tableHeaderCell}>Name</th>
                  <th className={styles.tableHeaderCell}>Age</th>
                  <th className={styles.tableHeaderCell}>Gender</th>
                </tr>
              </thead>
              <tbody>
                {passengerDetails.below18.map((p) => (
                  <tr key={p.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{p.name}</td>
                    <td className={styles.tableCell}>{p.age}</td>
                    <td className={styles.tableCell}>{p.gender}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.tableWrapper}>
            <h3 className={styles.tableTitle}>Above 18</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.tableHeaderCell}>Name</th>
                  <th className={styles.tableHeaderCell}>Age</th>
                  <th className={styles.tableHeaderCell}>Gender</th>
                </tr>
              </thead>
              <tbody>
                {passengerDetails.above18.map((p) => (
                  <tr key={p.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{p.name}</td>
                    <td className={styles.tableCell}>{p.age}</td>
                    <td className={styles.tableCell}>{p.gender}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPassengerCount = () => (
    <div className={styles.card}>
      <div className={styles.cardHeader}>Passenger Count by Destination</div>
      <div className={styles.cardBody}>
        <form onSubmit={(e) => { e.preventDefault(); fetchPassengerCount(formData.destination, formData.fromDate, formData.toDate); }} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Destination:</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              required
              className={styles.input}
              placeholder="Enter Destination"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>From Date:</label>
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>To Date:</label>
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>
          <button type="submit" className={`${styles.button} ${styles.primaryButton}`}>
            Submit
          </button>
        </form>
        <p className={styles.countDisplay}>Total Passengers: {passengerCount}</p>
      </div>
    </div>
  );

  const renderBookingCounts = () => (
    <div className={styles.card}>
      <div className={styles.cardHeader}>Booking Counts by Passenger Type</div>
      <div className={styles.cardBody}>
        <form onSubmit={(e) => { e.preventDefault(); fetchBookingCounts(formData.fromDate, formData.toDate); }} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>From Date:</label>
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>To Date:</label>
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>
          <button type="submit" className={`${styles.button} ${styles.primaryButton}`}>
            Submit
          </button>
        </form>
        <div className={styles.bookingCounts}>
          {bookingCounts.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.tableHeaderCell}>Passenger Type</th>
                  <th className={styles.tableHeaderCell}>Number of Bookings</th>
                </tr>
              </thead>
              <tbody>
                {bookingCounts.map((booking, index) => (
                  <tr key={index} className={styles.tableRow}>
                    <td className={styles.tableCell}>{booking.PassengerType}</td>
                    <td className={styles.tableCell}>{booking.NumberOfBookings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className={styles.emptyState}>No data available.</p>}
        </div>
      </div>
    </div>
  );

  const renderPastFlights = () => (
    <div className={styles.card}>
      <div className={styles.cardHeader}>Past Flights Data</div>
      <div className={styles.cardBody}>
        <form onSubmit={(e) => { e.preventDefault(); fetchPastFlights(formData.origin, formData.destinationQuery); }} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Origin:</label>
            <input
              type="text"
              name="origin"
              value={formData.origin}
              onChange={handleInputChange}
              required
              className={styles.input}
              placeholder="Enter Origin Airport"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Destination:</label>
            <input
              type="text"
              name="destinationQuery"
              value={formData.destinationQuery}
              onChange={handleInputChange}
              required
              className={styles.input}
              placeholder="Enter Destination Airport"
            />
          </div>
          <button type="submit" className={`${styles.button} ${styles.primaryButton}`}>
            Submit
          </button>
        </form>
        <div className={styles.flightList}>
          {pastFlights.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.tableHeaderCell}>Flight ID</th>
                  <th className={styles.tableHeaderCell}>Origin Airport</th>
                  <th className={styles.tableHeaderCell}>Destination Airport</th>
                  <th className={styles.tableHeaderCell}>Status</th>
                  <th className={styles.tableHeaderCell}>Passenger Count</th>
                </tr>
              </thead>
              <tbody>
                {pastFlights.map((flight) => (
                  <tr key={flight.Flight_ID} className={styles.tableRow}>
                    <td className={styles.tableCell}>{flight.Flight_ID}</td>
                    <td className={styles.tableCell}>{flight.OriginAirportName}</td>
                    <td className={styles.tableCell}>{flight.DestinationAirportName}</td>
                    <td className={styles.tableCell}>{flight.Status}</td>
                    <td className={styles.tableCell}>{flight.PassengerCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className={styles.emptyState}>No past flights found.</p>}
        </div>
      </div>
    </div>
  );

  const renderRevenueData = () => (
    <div className={styles.card}>
      <div className={styles.cardHeader}>Revenue by Aircraft Type</div>
      <div className={styles.cardBody}>
        {revenueData.length > 0 ? (
          <div className={styles.revenueContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.tableHeaderCell}>Aircraft</th>
                  <th className={styles.tableHeaderCell}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {revenueData.map((r) => (
                  <tr key={r.model} className={styles.tableRow}>
                    <td className={styles.tableCell}>{r.model}</td>
                    <td className={styles.tableCell}>${r.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ 
              width: '100%', 
              height: '300px', 
              marginTop: '20px',
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px'
            }}>
              <div style={{ 
                display: 'flex', 
                height: '100%', 
                alignItems: 'flex-end', 
                gap: '20px', 
                justifyContent: 'space-around'
              }}>
                {revenueData.map((r, index) => {
                  const maxRevenue = Math.max(...revenueData.map(item => item.revenue));
                  const height = (r.revenue / maxRevenue) * 80; // Using 80% of container height
                  return (
                    <div key={index} style={{ 
                      flex: '1',
                      maxWidth: '100px',
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      height: '100%',
                      justifyContent: 'flex-end'
                    }}>
                      <div 
                        style={{ 
                          width: '60%', 
                          height: `${height}%`, 
                          backgroundColor: '#4a90e2',
                          borderRadius: '8px 8px 0 0',
                          transition: 'height 0.5s ease',
                          minHeight: '20px'
                        }} 
                      />
                      <div style={{ 
                        marginTop: '8px', 
                        textAlign: 'center', 
                        fontSize: '12px',
                        width: '100%',
                        wordWrap: 'break-word'
                      }}>
                        <div style={{ fontWeight: 'bold' }}>{r.model}</div>
                        <div>${r.revenue.toLocaleString()}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : <p className={styles.emptyState}>Loading revenue data...</p>}
      </div>
    </div>
  );

  const renderAddFlight = () => (
    <div className={styles.card}>
      <div className={styles.cardHeader}>Add New Flight</div>
      <div className={styles.cardBody}>
        <form onSubmit={handleAddFlightSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Airplane ID:</label>
            <input
              type="number"
              name="Airplane_ID"
              value={addFlightData.Airplane_ID}
              onChange={handleAddFlightChange}
              required
              min="0"
              step="1"
              className={styles.input}
              placeholder="Enter Airplane ID"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Route ID:</label>
            <input
              type="text"
              name="Route_ID"
              value={addFlightData.Route_ID}
              onChange={handleAddFlightChange}
              required
              className={styles.input}
              placeholder="Enter Route ID"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Departure Date:</label>
            <input
              type="date"
              name="Departure_date"
              value={addFlightData.Departure_date}
              onChange={handleAddFlightChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Arrival Date:</label>
            <input
              type="date"
              name="Arrival_date"
              value={addFlightData.Arrival_date}
              onChange={handleAddFlightChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Departure Time:</label>
            <input
              type="time"
              name="Departure_time"
              value={addFlightData.Departure_time}
              onChange={handleAddFlightChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Arrival Time:</label>
            <input
              type="time"
              name="Arrival_time"
              value={addFlightData.Arrival_time}
              onChange={handleAddFlightChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Economy Price:</label>
            <input
              type="number"
              name="Economy_Price"
              value={addFlightData.Economy_Price}
              onChange={handleAddFlightChange}
              required
              min="0"
              step="0.01"
              className={styles.input}
              placeholder="Enter Economy Price"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Business Price:</label>
            <input
              type="number"
              name="Business_Price"
              value={addFlightData.Business_Price}
              onChange={handleAddFlightChange}
              required
              min="0"
              step="0.01"
              className={styles.input}
              placeholder="Enter Business Price"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Platinum Price:</label>
            <input
              type="number"
              name="Platinum_Price"
              value={addFlightData.Platinum_Price}
              onChange={handleAddFlightChange}
              required
              min="0"
              step="0.01"
              className={styles.input}
              placeholder="Enter Platinum Price"
            />
          </div>
          <button type="submit" className={`${styles.button} ${styles.primaryButton}`} disabled={addFlightStatus.loading}>
            {addFlightStatus.loading ? 'Adding Flight...' : 'Add Flight'}
          </button>
        </form>
        {addFlightStatus.message && (
          <p className={`${styles.message} ${addFlightStatus.message.includes('successfully') ? styles.successMessage : styles.errorMessage}`}>
            {addFlightStatus.message}
          </p>
        )}
      </div>
    </div>
  );

  const renderChangeFlightStatus = () => (
    <div className={styles.card}>
      <div className={styles.cardHeader}>Change Flight Status</div>
      <div className={styles.cardBody}>
        <form onSubmit={handleChangeStatusSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Flight ID:</label>
            <select
              name="Flight_ID"
              value={changeStatusData.Flight_ID}
              onChange={handleChangeStatusInput}
              required
              className={styles.select}
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
          <div className={styles.formGroup}>
            <label className={styles.label}>New Status:</label>
            <select
              name="newStatus"
              value={changeStatusData.newStatus}
              onChange={handleChangeStatusInput}
              required
              className={styles.select}
            >
              <option value="" disabled>Select new status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Delayed">Delayed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <button type="submit" className={`${styles.button} ${styles.primaryButton}`} disabled={changeStatus.loading}>
            {changeStatus.loading ? 'Updating Status...' : 'Update Status'}
          </button>
        </form>
        {changeStatus.message && (
          <p className={`${styles.message} ${changeStatus.message.includes('successfully') ? styles.successMessage : styles.errorMessage}`}>
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
    <div className={styles.adminContainer}>
      <h1 className={styles.title}>Airline Admin Dashboard</h1>
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'passengerDetails' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('passengerDetails')}
        >
          Passenger Details
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'passengerCount' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('passengerCount')}
        >
          Passenger Count
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'bookingCounts' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('bookingCounts')}
        >
          Booking Counts
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'pastFlights' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('pastFlights')}
        >
          Past Flights
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'revenueData' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('revenueData')}
        >
          Revenue Data
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'addFlight' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('addFlight')}
        >
          Add Flight
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'changeFlightStatus' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('changeFlightStatus')}
        >
          Change Flight Status
        </button>
      </div>
      <div className={styles.content}>
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