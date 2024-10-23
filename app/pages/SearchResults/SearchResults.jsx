'use client';

import React, { useEffect, useState } from 'react';
import './SearchResults.css';

const SearchResults = ({ route, departureDate }) => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlights = async () => {
      if (route && departureDate) {
        try {
          const response = await fetch(`/api/getFlight?route=${route}&date=${departureDate}`);
          if (!response.ok) {
            throw new Error('Failed to fetch flights');
          }
          const data = await response.json();
          setFlights(data.flights);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setError('Missing route or date information');
        setLoading(false);
      }
    };

    fetchFlights();
  }, [route, departureDate]);

  if (loading) {
    return <div className="search-results">Loading...</div>;
  }

  if (error) {
    return <div className="search-results">Error: {error}</div>;
  }

  return (
    <div className="search-results">
      <h1>Flight Search Results</h1>
      {flights.length > 0 ? (
        <ul className="flight-list">
          {flights.map((flight) => (
            <li key={flight.flightId} className="flight-item">
              <h2>Flight {flight.flightId}</h2>
              <p>Departure: {flight.departureDate} at {flight.departureTime}</p>
              <p>Arrival: {flight.arrivalDate} at {flight.arrivalTime}</p>
              <p>Status: {flight.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-flights">No flights found for the selected criteria.</p>
      )}
    </div>
  );
};

export default SearchResults;