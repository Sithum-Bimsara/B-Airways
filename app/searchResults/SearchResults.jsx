'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './SearchResults.css';

// Import React Leaflet components
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Import Leaflet's icon to fix marker issues
import L from 'leaflet';

// Create custom location icon
const locationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

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
    // Check if BookingData exists in localStorage and refresh if it does
    const bookingData = localStorage.getItem('BookingData');
    const refresh = localStorage.getItem('refresh');
    if (bookingData && !refresh) {
      window.location.reload();
      localStorage.setItem('refresh', 'true');
    }
  }, []);

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
                      <div className="seats-available">
                        <span className="seats-icon" role="img" aria-label="seats">💺</span>
                        <p><strong>Available Seats:</strong></p>
                        <p>Economy: {flight.availableSeats.economy}</p>
                        <p>Business: {flight.availableSeats.business}</p>
                        <p>Platinum: {flight.availableSeats.platinum}</p>
                      </div>
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
                    disabled={flight.availableSeats.economy === 0 && flight.availableSeats.business === 0 && flight.availableSeats.platinum === 0}
                  >
                    {flight.availableSeats.economy === 0 && flight.availableSeats.business === 0 && flight.availableSeats.platinum === 0 ? 'Fully Booked' : 'Select Flight'}
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
                        <div className="seats-available">
                          <span className="seats-icon" role="img" aria-label="seats">💺</span>
                          <p><strong>Available Seats:</strong></p>
                          <p>Economy: {flight.availableSeats.economy}</p>
                          <p>Business: {flight.availableSeats.business}</p>
                          <p>Platinum: {flight.availableSeats.platinum}</p>
                        </div>
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
                      disabled={flight.availableSeats.economy === 0 && flight.availableSeats.business === 0 && flight.availableSeats.platinum === 0}
                    >
                      {flight.availableSeats.economy === 0 && flight.availableSeats.business === 0 && flight.availableSeats.platinum === 0 ? 'Fully Booked' : 'Select Flight'}
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

      {/* Interactive Map with Markers for BIA and BOM */}
      <div className="map-container">
        <MapContainer 
          center={[22.1747, 58.5652]} // Centered between BIA and BOM
          zoom={4} 
          scrollWheelZoom={false} 
          style={{ height: '400px', width: '100%', borderRadius: '10px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Marker for BIA */}
          <Marker position={[20.2609, 42.6043]} icon={locationIcon}>
            <Popup>
              <b>Bisha Airport (BIA)</b><br />
              Bisha, Saudi Arabia<br />
              <small>Coordinates: 20.2609°N, 42.6043°E</small>
            </Popup>
          </Marker>
          {/* Marker for BOM */}
          <Marker position={[19.0896, 72.8656]} icon={locationIcon}>
            <Popup>
              <b>Chhatrapati Shivaji Maharaj International Airport (BOM)</b><br />
              Mumbai, India<br />
              <small>Coordinates: 19.0896°N, 72.8656°E</small>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default SearchResults;