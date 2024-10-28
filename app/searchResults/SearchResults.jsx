'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './SearchResults.css';

const SearchResults = ({ route1, route2, departureDate, returnDate }) => {
  const [outboundFlights, setOutboundFlights] = useState([]);
  const [returnFlights, setReturnFlights] = useState([]);
  const [loadingOutbound, setLoadingOutbound] = useState(true);
  const [loadingReturn, setLoadingReturn] = useState(true);
  const [errorOutbound, setErrorOutbound] = useState(null);
  const [errorReturn, setErrorReturn] = useState(null);

  const router = useRouter();
  
  const [flightType, setFlightType] = useState('roundtrip'); // Default to 'roundtrip'

  useEffect(() => {
    const storedFlightType = localStorage.getItem('flightType');
    if (storedFlightType) {
      setFlightType(storedFlightType);
    }
  }, []);

  useEffect(() => {
    const fetchOutboundFlights = async () => {
      if (route1 && departureDate) {
        try {
          const response = await fetch(`/api/getFlight?route=${route1}&date=${departureDate}`);
          if (!response.ok) {
            throw new Error('Failed to fetch outbound flights');
          }
          const data = await response.json();
          setOutboundFlights(data.flights);
        } catch (error) {
          setErrorOutbound(error.message);
        } finally {
          setLoadingOutbound(false);
        }
      } else {
        setErrorOutbound('Missing route1 or departure date information');
        setLoadingOutbound(false);
      }
    };

    fetchOutboundFlights();
  }, [route1, departureDate]);

  useEffect(() => {
    const fetchReturnFlights = async () => {
      if (flightType === 'roundtrip' && returnDate) {
        try {
          const response = await fetch(`/api/getFlight?route=${route2}&date=${returnDate}`);
          if (!response.ok) {
            throw new Error('Failed to fetch return flights');
          }
          const data = await response.json();
          setReturnFlights(data.flights);
        } catch (error) {
          setErrorReturn(error.message);
        } finally {
          setLoadingReturn(false);
        }
      } else {
        setLoadingReturn(false);
      }
    };

    fetchReturnFlights();
  }, [flightType, returnDate, route2]);

  const handleSelectFlight = (flightId) => {
    localStorage.setItem('selectedFlightId', flightId);
    router.push('/passengerDetails');
  };

  return (
    <div className="search-results">
      <h1>Flight Search Results</h1>
      <div className={`flights-container ${flightType === 'oneway' ? 'oneway' : 'roundtrip'}`}>
        <div className="flight-section outbound">
          <h2>Outbound Flights</h2>
          {loadingOutbound ? (
            <div className="loading">
              <div className="spinner"></div>
              <span>Loading outbound flights...</span>
            </div>
          ) : errorOutbound ? (
            <div className="error">Error: {errorOutbound}</div>
          ) : outboundFlights.length > 0 ? (
            <ul className="flight-list">
              {outboundFlights.map((flight) => (
                <li key={flight.flightId} className="flight-item">
                  <h3>Flight {flight.flightId}</h3>
                  <div className="flight-details">
                    <div className="flight-timing">
                      <p>
                        <strong>Departure:</strong> {flight.departureDate} at {flight.departureTime}
                      </p>
                      <p>
                        <strong>Arrival:</strong> {flight.arrivalDate} at {flight.arrivalTime}
                      </p>
                      <p className="flight-status">
                        <strong>Status:</strong> {flight.status}
                      </p>
                      <p className="seats-available">
                        <span className="seats-icon" role="img" aria-label="seats">💺</span>
                        {flight.availableSeats} seats available
                      </p>
                    </div>
                    <div className="flight-pricing">
                      <h4>Available Fares:</h4>
                      {flight.pricing && (
                        <div className="pricing-options">
                          {flight.pricing.economy && (
                            <div className="price-item">
                              <span>Economy:</span> ${flight.pricing.economy.toFixed(2)}
                            </div>
                          )}
                          {flight.pricing.business && (
                            <div className="price-item">
                              <span>Business:</span> ${flight.pricing.business.toFixed(2)}
                            </div>
                          )}
                          {flight.pricing.platinum && (
                            <div className="price-item">
                              <span>Platinum:</span> ${flight.pricing.platinum.toFixed(2)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleSelectFlight(flight.flightId)} 
                    className="select-button"
                    disabled={flight.availableSeats === 0}
                  >
                    {flight.availableSeats === 0 ? 'Fully Booked' : 'Select Flight'}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-flights">No outbound flights found for the selected criteria.</p>
          )}
        </div>

        {flightType === 'roundtrip' && (
          <div className="flight-section return">
            <h2>Return Flights</h2>
            {loadingReturn ? (
              <div className="loading">
                <div className="spinner"></div>
                <span>Loading return flights...</span>
              </div>
            ) : errorReturn ? (
              <div className="error">Error: {errorReturn}</div>
            ) : returnFlights.length > 0 ? (
              <ul className="flight-list">
                {returnFlights.map((flight) => (
                  <li key={flight.flightId} className="flight-item">
                    <h3>Flight {flight.flightId}</h3>
                    <div className="flight-details">
                      <div className="flight-timing">
                        <p>
                          <strong>Departure:</strong> {flight.departureDate} at {flight.departureTime}
                        </p>
                        <p>
                          <strong>Arrival:</strong> {flight.arrivalDate} at {flight.arrivalTime}
                        </p>
                        <p className="flight-status">
                          <strong>Status:</strong> {flight.status}
                        </p>
                        <p className="seats-available">
                          <span className="seats-icon" role="img" aria-label="seats">💺</span>
                          {flight.availableSeats} seats available
                        </p>
                      </div>
                      <div className="flight-pricing">
                        <h4>Available Fares:</h4>
                        {flight.pricing && (
                          <div className="pricing-options">
                            {flight.pricing.economy && (
                              <div className="price-item">
                                <span>Economy:</span> ${flight.pricing.economy.toFixed(2)}
                              </div>
                            )}
                            {flight.pricing.business && (
                              <div className="price-item">
                                <span>Business:</span> ${flight.pricing.business.toFixed(2)}
                              </div>
                            )}
                            {flight.pricing.platinum && (
                              <div className="price-item">
                                <span>Platinum:</span> ${flight.pricing.platinum.toFixed(2)}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleSelectFlight(flight.flightId)} 
                      className="select-button"
                      disabled={flight.availableSeats === 0}
                    >
                      {flight.availableSeats === 0 ? 'Fully Booked' : 'Select Flight'}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-flights">No return flights found for the selected criteria.</p>
            )}
          </div>
        )}
      </div>

      {/* World map image below the flight boxes */}
      <div className="world-map-container">
        {/* Optional: Add interactive elements or tooltips for better UX */}
      </div>
    </div>
  );
};

export default SearchResults;