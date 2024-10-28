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
      if (returnDate) {
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
  }, [returnDate]);

  const handleSelectFlight = (flightId) => {
    localStorage.setItem('selectedFlightId', flightId);
    router.push('/passengerDetails');
  };

  return (
    <div className="search-results">
      <h1>Flight Search Results</h1>
      <div className="flights-container">
        <div className="flight-section outbound">
          <h2>Outbound Flights</h2>
          {loadingOutbound ? (
            <div className="loading">Loading outbound flights...</div>
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
                        Departure: {flight.departureDate} at {flight.departureTime}
                      </p>
                      <p>
                        Arrival: {flight.arrivalDate} at {flight.arrivalTime}
                      </p>
                      <p className="flight-status">Status: {flight.status}</p>
                      <p className="seats-available">
                        <span className="seats-icon">💺</span>
                        {flight.availableSeats} seats available
                      </p>
                    </div>
                    <div className="flight-pricing">
                      <h4>Available Fares:</h4>
                      {flight.pricing && (
                        <div className="pricing-options">
                          {flight.pricing.economy && (
                            <div className="price-item">
                              <span>Economy:</span> ${flight.pricing.economy}
                            </div>
                          )}
                          {flight.pricing.business && (
                            <div className="price-item">
                              <span>Business:</span> ${flight.pricing.business}
                            </div>
                          )}
                          {flight.pricing.platinum && (
                            <div className="price-item">
                              <span>Platinum:</span> ${flight.pricing.platinum}
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

        {returnDate && (
          <div className="flight-section return">
            <h2>Return Flights</h2>
            {loadingReturn ? (
              <div className="loading">Loading return flights...</div>
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
                          Departure: {flight.departureDate} at {flight.departureTime}
                        </p>
                        <p>
                          Arrival: {flight.arrivalDate} at {flight.arrivalTime}
                        </p>
                        <p className="flight-status">Status: {flight.status}</p>
                        <p className="seats-available">
                          <span className="seats-icon">💺</span>
                          {flight.availableSeats} seats available
                        </p>
                      </div>
                      <div className="flight-pricing">
                        <h4>Available Fares:</h4>
                        {flight.pricing && (
                          <div className="pricing-options">
                            {flight.pricing.economy && (
                              <div className="price-item">
                                <span>Economy:</span> ${flight.pricing.economy}
                              </div>
                            )}
                            {flight.pricing.business && (
                              <div className="price-item">
                                <span>Business:</span> ${flight.pricing.business}
                              </div>
                            )}
                            {flight.pricing.platinum && (
                              <div className="price-item">
                                <span>Platinum:</span> ${flight.pricing.platinum}
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
      </div>
    </div>
  );
};

export default SearchResults;