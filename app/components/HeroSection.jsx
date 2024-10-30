'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaneDeparture, faPlaneArrival, faCalendarAlt, faExclamationCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import './HeroSection.css';

function HeroSection() {
  const router = useRouter();
  const [fromWhere, setFromWhere] = useState('');
  const [whereTo, setWhereTo] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [originCodes, setOriginCodes] = useState([]);
  const [destinationCodes, setDestinationCodes] = useState([]);
  const [route1, setRoute1] = useState(null);
  const [route2, setRoute2] = useState(null);
  const [flightType, setFlightType] = useState('oneway');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchAirportCodes();
    // Clear all localStorage data
    localStorage.clear();
    // Set initial flight type in localStorage
    localStorage.setItem('flightType', 'oneway');
  }, []);

  useEffect(() => {
    if (fromWhere && whereTo) {
      fetchRoutes(fromWhere, whereTo);
    }
  }, [fromWhere, whereTo]);

  const fetchAirportCodes = async () => {
    try {
      const response = await fetch('/api/airportCodes');
      const data = await response.json();
      setOriginCodes(data.originCodes);
      setDestinationCodes(data.destinationCodes);
    } catch (error) {
      console.error('Error fetching airport codes:', error);
    }
  };

  const fetchRoutes = async (origin, destination) => {
    if (origin && destination) {
      try {
        const response1 = await fetch(`/api/getRoute?origin=${origin}&destination=${destination}`);
        const data1 = await response1.json();
        const response2 = await fetch(`/api/getRoute?origin=${destination}&destination=${origin}`);
        const data2 = await response2.json();

        const hasOutbound = data1 && data1.length > 0 && data1[0].Route_ID;
        const hasReturn = data2 && data2.length > 0 && data2[0].Route_ID;

        if (hasOutbound) {
          setRoute1({ id: data1[0].Route_ID });
        } else {
          setRoute1(null);
        }

        if (hasReturn) {
          setRoute2({ id: data2[0].Route_ID });
        } else {
          setRoute2(null);
          setReturnDate('');
        }

        if (!hasOutbound && !hasReturn && flightType === 'roundtrip') {
          setShowAlert(true);
          setAlertMessage(`No flights available in either direction between ${origin} and ${destination}. Please try different locations.`);
        } else if (!hasOutbound) {
          setShowAlert(true);
          setAlertMessage(`No flights available from ${origin} to ${destination}. Please try different locations.`);
        } else if (!hasReturn && flightType === 'roundtrip') {
          setShowAlert(true);
          setAlertMessage(`No return flights available from ${destination} to ${origin}. Please try different locations.`);
        }

      } catch (error) {
        console.error('Error fetching routes:', error);
        setRoute1(null);
        setRoute2(null);
        setReturnDate('');
        setShowAlert(true);
        setAlertMessage('Error checking flight routes. Please try again.');
      }
    }
  };

  const handleSearch = () => {
    let queryParams;
    if (route1 && departureDate && !returnDate) {
      queryParams = new URLSearchParams({
        route1: route1.id,
        departureDate: departureDate,
      }).toString();
    } 
    else if (route1 && route2 && departureDate && returnDate) {
      queryParams = new URLSearchParams({
        route1: route1.id,
        route2: route2.id,
        departureDate: departureDate,
        returnDate: returnDate,
      }).toString();
    } 
    else {
      console.error('Please fill in all required fields');
      return;
    }

    const searchUrl = `/searchResults?${queryParams}`;
    localStorage.setItem('lastSearchUrl', searchUrl);
    localStorage.setItem('flightType', flightType);
    localStorage.setItem('fromWhere', fromWhere);
    localStorage.setItem('whereTo', whereTo);
    router.push(searchUrl);
  };

  const handleFromWhereChange = async (event) => {
    const selectedFromWhere = event.target.value;
    setFromWhere(selectedFromWhere);
    setShowAlert(false);
    fetchRoutes(selectedFromWhere, whereTo);
  };

  const handleWhereToChange = async (event) => {
    const selectedWhereTo = event.target.value;
    setWhereTo(selectedWhereTo);
    setShowAlert(false);
    fetchRoutes(fromWhere, selectedWhereTo);
  };

  const handleDepartureDateChange = (event) => setDepartureDate(event.target.value);
  const handleReturnDateChange = (event) => setReturnDate(event.target.value);

  const handleFlightTypeChange = (type) => {
    setFlightType(type);
    localStorage.setItem('flightType', type);
    if (type === 'oneway' && !route1) {
      setReturnDate('');
      setShowAlert(true);
      setAlertMessage(`No flights available from  ${fromWhere} and ${whereTo}. Please try different locations.`);
    } else if (type === 'roundtrip' && fromWhere && whereTo && !route2 && route1) {
      setShowAlert(true);
      setAlertMessage(`No return flights available from ${whereTo} to ${fromWhere}. Please try different locations.`);
    } else if (type === 'roundtrip' && fromWhere && whereTo && !route2 && !route1) {
      setShowAlert(true);
      setAlertMessage(`No flights available in either direction between ${fromWhere} and ${whereTo}. Please try different locations.`);
    }
  };

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return (
    <section className="hero-section">
      <header className="header">
        <h1 className="main-title">It's more than</h1>
        <br />
        <br />
        <h1 className="main-title">just a trip</h1>
      </header>
      
      {showAlert && (
        <div className="alert">
          <FontAwesomeIcon icon={faExclamationCircle} className="alert-icon" />
          <div className="alert-content">{alertMessage}</div>
          <button 
            onClick={() => setShowAlert(false)}
            aria-label="Close alert"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}

      <div className="flight-type-selector">
        <button 
          className={`type-button ${flightType === 'oneway' ? 'active' : ''}`}
          onClick={() => handleFlightTypeChange('oneway')}
        >
          One Way
        </button>
        <button 
          className={`type-button ${flightType === 'roundtrip' ? 'active' : ''}`}
          onClick={() => handleFlightTypeChange('roundtrip')}
        >
          Round Trip
        </button>
      </div>

      <div className="search-bar">
        <div className="input-group">
          <FontAwesomeIcon icon={faPlaneDeparture} className="icon" />
          <select value={fromWhere} onChange={handleFromWhereChange} className="dropdown">
            <option value="" disabled>From where?</option>
            {originCodes.map((airport, index) => (
              <option key={index} value={airport.code}>
                {airport.code} - {airport.name}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <FontAwesomeIcon icon={faPlaneArrival} className="icon" />
          <select value={whereTo} onChange={handleWhereToChange} className="dropdown">
            <option value="" disabled>Where to?</option>
            {destinationCodes.map((airport, index) => (
              <option key={index} value={airport.code}>
                {airport.code} - {airport.name}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
          <input 
            type="date" 
            value={departureDate} 
            onChange={handleDepartureDateChange} 
            className="dropdown" 
          />
        </div>
        {flightType === 'roundtrip' && (
          <div className="input-group">
            <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
            <input 
              type="date" 
              value={returnDate} 
              onChange={handleReturnDateChange} 
              className="dropdown" 
              disabled={!route2}
            />
          </div>
        )}
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>
    </section>
  );
}

export default HeroSection;