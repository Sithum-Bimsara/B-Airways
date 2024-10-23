'use client';

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
  const [route1, setRoute1] = useState(null);
  const [route2, setRoute2] = useState(null);

  useEffect(() => {
    fetchAirportCodes();
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
        if (data1 && data1.length > 0 && data1[0].Route_ID) {
          setRoute1({ id: data1[0].Route_ID });
        } else {
          setRoute1(null);
        }

        const response2 = await fetch(`/api/getRoute?origin=${destination}&destination=${origin}`);
        const data2 = await response2.json();
        if (data2 && data2.length > 0 && data2[0].Route_ID) {
          setRoute2({ id: data2[0].Route_ID });
        } else {
          setRoute2(null);
          setReturnDate(''); // Clear return date if route2 is not valid
        }
      } catch (error) {
        console.error('Error fetching routes:', error);
        setRoute1(null);
        setRoute2(null);
        setReturnDate(''); // Clear return date if there's an error
      }
    }
  };

  const handleSearch = () => {
    if (route1 && departureDate && !returnDate) {
      // Construct the URL with query parameters
      const queryParams = new URLSearchParams({
        route1: route1.id,
        departureDate: departureDate,
      }).toString();

      // Navigate to the search results page with the route ID and departure date
      router.push(`/searchResults?${queryParams}`);
    } 
    else if (route1 && route2 && departureDate && returnDate) {
      // Construct the URL with query parameters
      const queryParams = new URLSearchParams({
        route1: route1.id,
        route2: route2.id,
        departureDate: departureDate,
        returnDate: returnDate,
      }).toString();
      router.push(`/searchResults?${queryParams}`);
    } 
    else {
      console.error('Please fill in all required fields');
    }
  };

  const handleFromWhereChange = async (event) => {
    const selectedFromWhere = event.target.value;
    setFromWhere(selectedFromWhere);
    fetchRoutes(selectedFromWhere, whereTo);
  };

  const handleWhereToChange = async (event) => {
    const selectedWhereTo = event.target.value;
    setWhereTo(selectedWhereTo);
    fetchRoutes(fromWhere, selectedWhereTo);
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
          <input 
            type="date" 
            value={returnDate} 
            onChange={handleReturnDateChange} 
            className="dropdown" 
            disabled={!route2}
          />
        </div>
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>
    </section>
  );
}

export default HeroSection;