"use client"; // Add this line at the top

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Table } from 'react-bootstrap';


const RevenueTable = ({ data }) => (
  <Table striped bordered hover>
    <thead>
      <tr>
        <th>Model Name</th>
        <th>Version</th>
        <th>Total Revenue</th>
      </tr>
    </thead>
    <tbody>
      {data.map((item) => (
        <tr key={item.model}>
          <td>{item.model}</td>
          <td>{item.version}</td>
          <td>{item.revenue}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);

const BookingCountTable = ({ bookingCounts }) => (
  <Table striped bordered hover>
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
  </Table>
);

export default function AdminDashboard() {
  const [passengerCount, setPassengerCount] = useState(0);
  const [bookingCounts, setBookingCounts] = useState({ frequent: 0, gold: 0, normal: 0 });
  const [formData, setFormData] = useState({
    destination: '',
    fromDate: '',
    toDate: '',
  });

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
    { model: 'Airbus A320', version: 'A320-200', revenue: '$1,234,567' },
    { model: 'Boeing 737', version: 'MAX 10', revenue: '$2,345,678' },
    { model: 'Embraer E175', version: 'E2', revenue: '$987,654' },
  ];

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Airline Admin Dashboard</h1>

      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          Total Revenue by each model
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
              <Form onSubmit={handlePassengerCountSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Passengers Travelling to</Form.Label>
                  <Form.Control
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    placeholder="Enter destination"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>From</Form.Label>
                  <Form.Control
                    type="date"
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>To</Form.Label>
                  <Form.Control
                    type="date"
                    name="toDate"
                    value={formData.toDate}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">Submit</Button>
              </Form>
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
              <Form onSubmit={handleBookingCountSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>From</Form.Label>
                  <Form.Control type="date" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>To</Form.Label>
                  <Form.Control type="date" />
                </Form.Group>
                <Button variant="primary" type="submit">Submit</Button>
              </Form>
              <BookingCountTable bookingCounts={bookingCounts} className="mt-3" />
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header bg-primary text-white">Past Flight Report</div>
        <div className="card-body">
          <Form className="mb-3">
            <div className="row">
              <div className="col-md-5">
                <Form.Group>
                  <Form.Label>Passengers Travelling From</Form.Label>
                  <Form.Control type="text" placeholder="Enter origin" />
                </Form.Group>
              </div>
              <div className="col-md-5">
                <Form.Group>
                  <Form.Label>Passengers Travelling To</Form.Label>
                  <Form.Control type="text" placeholder="Enter destination" />
                </Form.Group>
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <Button variant="primary" type="submit" className="w-100">Submit</Button>
              </div>
            </div>
          </Form>
          <Table striped bordered hover>
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
          </Table>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header bg-primary text-white">Passenger Details by Age</div>
        <div className="card-body">
          <Form className="mb-3">
            <div className="row">
              <div className="col-md-10">
                <Form.Group>
                  <Form.Label>Select Flight No</Form.Label>
                  <Form.Control type="text" placeholder="Enter flight number" />
                </Form.Group>
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <Button variant="primary" type="submit" className="w-100">Submit</Button>
              </div>
            </div>
          </Form>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Passenger Name</th>
                <th>Passenger Number</th>
                <th>Age</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>P001</td>
                <td>35</td>
              </tr>
              <tr>
                <td>Jane Smith</td>
                <td>P002</td>
                <td>28</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
