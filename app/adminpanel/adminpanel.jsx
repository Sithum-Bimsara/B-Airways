import React, { useState } from 'react';
import AdminProtectedRoute from '../components/AdminProtectedRoute';
import './adminpanel.css';

const RevenueTable = ({ data }) => (
  <table className="table table-striped table-bordered hover">
    <thead>
      <tr>
        <th>Model Name</th>
        <th>Model_ID</th>
        <th>Total Revenue</th>
      </tr>
    </thead>
    <tbody>
      {data.map((item) => (
        <tr key={item.model}>
          <td>{item.model}</td>
          <td>{item.Model_ID}</td>
          <td>{item.revenue}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const BookingCountTable = ({ bookingCounts }) => (
  <table className="table table-striped table-bordered hover">
    <thead>
      <tr>
        <th>Type</th>
        <th>Count</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(bookingCounts).map(([type, count]) => (
        <tr key={type}>
          <td>{type}</td>
          <td>{count}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const AdminPanel = () => {
  const [passengerCount, setPassengerCount] = useState(0);
  const [bookingCounts, setBookingCounts] = useState({ frequent: 0, gold: 0, normal: 0 });
  const [formData, setFormData] = useState({
    destination: '',
    fromDate: '',
    toDate: '',
  });

  const [passengers, setPassengers] = useState([
    { name: 'John Doe', number: 'P001', age: 35 },
    { name: 'Jane Smith', number: 'P002', age: 28 },
    { name: 'Alice Brown', number: 'P003', age: 17 },
    { name: 'Bob White', number: 'P004', age: 15 },
  ]);

  const handlePassengerCountSubmit = (e) => {
    e.preventDefault();
    setPassengerCount(Math.floor(Math.random() * 100));
  };

  const handleBookingCountSubmit = (e) => {
    e.preventDefault();
    setBookingCounts({
      frequent: Math.floor(Math.random() * 20),
      gold: Math.floor(Math.random() * 15),
      normal: Math.floor(Math.random() * 30),
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const revenueData = [
    { model: 'Airbus A320', Model_ID: 'A320-200', revenue: '$1,234,567' },
    { model: 'Boeing 737', Model_ID: 'MAX 10', revenue: '$2,345,678' },
    { model: 'Embraer E175', Model_ID: 'E2', revenue: '$987,654' },
  ];

  const below18Passengers = passengers.filter(p => p.age < 18);
  const above18Passengers = passengers.filter(p => p.age >= 18);

  return (
    <AdminProtectedRoute>
      <div className="admin-panel container mt-4">
        <h1 className="mb-4">Welcome to the Airline Admin Dashboard</h1>

        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            Total Revenue by Each Model
          </div>
          <div className="card-body">
            <RevenueTable data={revenueData} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header bg-primary text-white">Passenger Count</div>
              <div className="card-body">
                <form onSubmit={handlePassengerCountSubmit}>
                  <div className="mb-3">
                    <label htmlFor="destination" className="form-label">Passengers Travelling to</label>
                    <input
                      type="text"
                      className="form-control"
                      id="destination"
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      placeholder="Enter destination"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="fromDate" className="form-label">From</label>
                    <input
                      type="date"
                      className="form-control"
                      id="fromDate"
                      name="fromDate"
                      value={formData.fromDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="toDate" className="form-label">To</label>
                    <input
                      type="date"
                      className="form-control"
                      id="toDate"
                      name="toDate"
                      value={formData.toDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Submit</button>
                </form>
                <div className="mt-3">
                  <strong>Passenger Count: {passengerCount}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header bg-primary text-white">Booking Count</div>
              <div className="card-body">
                <form onSubmit={handleBookingCountSubmit}>
                  <div className="mb-3">
                    <label htmlFor="bookingFromDate" className="form-label">From</label>
                    <input type="date" className="form-control" id="bookingFromDate" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="bookingToDate" className="form-label">To</label>
                    <input type="date" className="form-control" id="bookingToDate" />
                  </div>
                  <button type="submit" className="btn btn-primary">Submit</button>
                </form>
                <BookingCountTable bookingCounts={bookingCounts} className="mt-3" />
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header bg-primary text-white">Past Flight Report</div>
          <div className="card-body">
            <form className="mb-3">
              <div className="row">
                <div className="col-md-5">
                  <div className="mb-3">
                    <label htmlFor="origin" className="form-label">Passengers Travelling From</label>
                    <input type="text" className="form-control" id="origin" placeholder="Enter origin" />
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="mb-3">
                    <label htmlFor="destination" className="form-label">Passengers Travelling To</label>
                    <input type="text" className="form-control" id="destination" placeholder="Enter destination" />
                  </div>
                </div>
                <div className="col-md-2 d-flex align-items-end">
                  <button type="submit" className="btn btn-primary w-100">Submit</button>
                </div>
              </div>
            </form>
            <table className="table table-striped table-bordered hover">
              <thead>
                <tr>
                  <th>Flight No</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Passenger Count</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>FL001</td>
                  <td>New York</td>
                  <td>London</td>
                  <td>180</td>
                </tr>
                <tr>
                  <td>FL002</td>
                  <td>Paris</td>
                  <td>Tokyo</td>
                  <td>220</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header bg-primary text-white">Passenger Details by Age</div>
          <div className="card-body">
            <form className="mb-3">
              <div className="row">
                <div className="col-md-10">
                  <div className="mb-3">
                    <label htmlFor="flightNo" className="form-label">Select Flight No</label>
                    <input type="text" className="form-control" id="flightNo" placeholder="Enter flight number" />
                  </div>
                </div>
                <div className="col-md-2 d-flex align-items-end">
                  <button className="btn btn-primary w-100" type="submit">Submit</button>
                </div>
              </div>
            </form>

            <h5>Passengers Below 18</h5>
            <table className="table table-striped table-bordered hover">
              <thead>
                <tr>
                  <th>Passenger Name</th>
                  <th>Passenger Number</th>
                  <th>Age</th>
                </tr>
              </thead>
              <tbody>
                {below18Passengers.map((passenger) => (
                  <tr key={passenger.number}>
                    <td>{passenger.name}</td>
                    <td>{passenger.number}</td>
                    <td>{passenger.age}</td>
                  </tr>
                ))}
                {below18Passengers.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center">No passengers below 18.</td>
                  </tr>
                )}
              </tbody>
            </table>

            <h5>Passengers 18 and Above</h5>
            <table className="table table-striped table-bordered hover">
              <thead>
                <tr>
                  <th>Passenger Name</th>
                  <th>Passenger Number</th>
                  <th>Age</th>
                </tr>
              </thead>
              <tbody>
                {above18Passengers.map((passenger) => (
                  <tr key={passenger.number}>
                    <td>{passenger.name}</td>
                    <td>{passenger.number}</td>
                    <td>{passenger.age}</td>
                  </tr>
                ))}
                {above18Passengers.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center">No passengers 18 or older.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  );
};

export default AdminPanel;