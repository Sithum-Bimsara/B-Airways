"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaneDeparture, faPlaneArrival, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import './HeroSection.css';

function HeroSection() {
  const router = useRouter();
  const [fromWhere, setFromWhere] = useState('');
  const [whereTo, setWhereTo] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [originCodes, setOriginCodes] = useState([]);
  const [destinationCodes, setDestinationCodes] = useState([]);
  const [route, setRoute] = useState(null);

  useEffect(() => {
    fetchAirportCodes();
  }, []);

  useEffect(() => {
    if (fromWhere && whereTo) {
      fetchRoute(fromWhere, whereTo);
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

  const fetchRoute = async (origin, destination) => {
    if (origin && destination) {
      try {
        const response = await fetch(`/api/getRoute?origin=${origin}&destination=${destination}`);
        const data = await response.json();
        if (data && data.length > 0 && data[0].Route_ID) {
          setRoute({ id: data[0].Route_ID });
        } else {
          setRoute(null);
        }
      } catch (error) {
        console.error('Error fetching route:', error);
        setRoute(null);
      }
    }
  };

  const handleSearch = () => {
    if (route && departureDate) {
      // Navigate to the search results page with the route ID and departure date
      router.push({
        pathname: '/SearchResults',
        query: {
          route: route.id,
          departureDate: departureDate,
        },
      });
    } else {
      console.error('Please fill in all required fields');
    }
  };

  const handleFromWhereChange = async (event) => {
    const selectedFromWhere = event.target.value;
    setFromWhere(selectedFromWhere);
    fetchRoute(selectedFromWhere, whereTo);
  };

  const handleWhereToChange = async (event) => {
    const selectedWhereTo = event.target.value;
    setWhereTo(selectedWhereTo);
    fetchRoute(fromWhere, selectedWhereTo);
  };

  const handleDepartureDateChange = (event) => setDepartureDate(event.target.value);
  const handleReturnDateChange = (event) => setReturnDate(event.target.value);

  return (
    <section className="hero-section">
      <header className="header">
        <h1 className="main-title">It's more than</h1>
        <h1 className="main-title">just a trip</h1>
      </header>
      <div className="search-bar">
        {/* From where dropdown */}
        <div className="input-group">
          <FontAwesomeIcon icon={faPlaneDeparture} className="icon" />
          <select value={fromWhere} onChange={handleFromWhereChange} className="dropdown">
            <option value="" disabled>From where?</option>
            {originCodes.map((code, index) => (
              <option key={index} value={code}>{code}</option>
            ))}
          </select>
        </div>
        {/* Where to dropdown */}
        <div className="input-group">
          <FontAwesomeIcon icon={faPlaneArrival} className="icon" />
          <select value={whereTo} onChange={handleWhereToChange} className="dropdown">
            <option value="" disabled>Where to?</option>
            {destinationCodes.map((code, index) => (
              <option key={index} value={code}>{code}</option>
            ))}
          </select>
        </div>
        {/* Departure date input */}
        <div className="input-group">
          <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
          <input type="date" value={departureDate} onChange={handleDepartureDateChange} className="dropdown" />
        </div>
        {/* Return date input */}
        <div className="input-group">
          <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
          <input type="date" value={returnDate} onChange={handleReturnDateChange} className="dropdown" />
        </div>
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>
    </section>
  );
}

export default HeroSection;