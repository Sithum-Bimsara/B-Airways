"use client";

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaneDeparture, faPlaneArrival, faCalendarAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import './HeroSection.css';

function HeroSection() {
  const [fromWhere, setFromWhere] = useState('');
  const [whereTo, setWhereTo] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [persons, setPersons] = useState(1);

  const handleFromWhereChange = (event) => setFromWhere(event.target.value);
  const handleWhereToChange = (event) => setWhereTo(event.target.value);
  const handleDateChange = (event) => setDepartureDate(event.target.value);
  const handlePersonsChange = (event) => setPersons(event.target.value);

  return (
    <section className="hero-section">
      <header className="header">
        <h1 className="main-title">It’s more than</h1>
        <h1 className="main-title">just a trip</h1>
      </header>
      <div className="search-bar">
        {/* From where dropdown */}
        <div className="input-group">
          <FontAwesomeIcon icon={faPlaneDeparture} className="icon" />
          <select value={fromWhere} onChange={handleFromWhereChange} className="dropdown">
            <option value="" disabled>From where?</option>
            <option value="New York">New York</option>
            <option value="Los Angeles">Los Angeles</option>
            <option value="Chicago">Chicago</option>
          </select>
        </div>
        {/* Where to dropdown */}
        <div className="input-group">
          <FontAwesomeIcon icon={faPlaneArrival} className="icon" />
          <select value={whereTo} onChange={handleWhereToChange} className="dropdown">
            <option value="" disabled>Where to?</option>
            <option value="Paris">Paris</option>
            <option value="London">London</option>
            <option value="Tokyo">Tokyo</option>
          </select>
        </div>
        {/* Departure date input */}
        <div className="input-group">
          <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
          <input type="date" value={departureDate} onChange={handleDateChange} className="dropdown" />
        </div>
        {/* Persons count dropdown */}
        <div className="input-group">
          <FontAwesomeIcon icon={faUser} className="icon" />
          <select value={persons} onChange={handlePersonsChange} className="dropdown">
            <option value="1">1 adult</option>
            <option value="2">2 adults</option>
            <option value="3">3 adults</option>
            <option value="4">4 adults</option>
          </select>
        </div>
        <button className="search-button">Search</button>
      </div>
    </section>
  );
}

export default HeroSection;
