'use client'; // Enable client-side rendering

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaneDeparture, faPlaneArrival, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import '../components/HeroSection.css';
import '../components/FlightDeals.css';
import '../components/PlacesToStay.css';
import '../components/Testimonials.css';

// Import images
import maldivesImage from '../assets/images/maldivesImage.jpg';
import moroccoImage from '../assets/images/moroccoImage.jpg';
import mongoliaImage from '../assets/images/mongoliaImage.jpg';
import sydneyImage from '../assets/images/sydney.jpg';
import kodaijiImage from '../assets/images/kodaiji.jpg';
import user1 from '../assets/images/user1.jpg';
import user2 from '../assets/images/user2.jpg';
import user3 from '../assets/images/user3.jpg';

function Home(){

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

  const deals = [
    {
      city: 'Sydney Opera House',
      location: 'Sydney',
      description: 'Take a stroll along the famous harbor',
      price: 981,
      image: sydneyImage,
    },
    {
      city: 'Kōdaiji Temple',
      location: 'Kyoto',
      description: 'Step back in time in the Gion district',
      price: 633,
      image: kodaijiImage,
    },
    {
      city: 'Sydney Opera House',
      location: 'Sydney',
      description: 'Take a stroll along the famous harbor',
      price: 981,
      image: sydneyImage, 
    },
    {
      city: 'Kōdaiji Temple',
      location: 'Kyoto',
      description: 'Step back in time in the Gion district',
      price: 633,
      image: kodaijiImage,
    },
  ];

  const places = [
    { 
      name: 'Maldives', 
      description: `Experience luxury and relaxation among the stunning 
                    atolls. The Maldives offers world-class resorts, pristine 
                    beaches, and incredible snorkeling and diving opportunities.`,
      image: maldivesImage 
    },
    { 
      name: 'Morocco', 
      description: `Explore the vibrant culture and ancient architecture of Morocco. 
                    Wander through colorful souks, visit the Ourika Valley, and 
                    enjoy the incredible cuisine.`,
      image: moroccoImage 
    },
    { 
      name: 'Mongolia', 
      description: `Immerse yourself in traditional Mongolian life by staying 
                    in yurts, known locally as gers. Experience the vast open 
                    landscapes, ride horses across the steppe, and explore 
                    the history of the Mongol Empire.`,
      image: mongoliaImage 
    },
  ];

  const testimonials = [
    {
      name: 'Yifei Chen',
      location: 'Seoul, South Korea',
      date: 'April 2019',
      review:
        'What a great experience using Tripma! I booked all of my flights for my gap year through Tripma and never had any issues. When I had to cancel a flight because of an emergency, Tripma support helped me out!',
      image: user1,
      rating: 5,
    },
    {
      name: 'Kaori Yamaguchi',
      location: 'Honolulu, Hawaii',
      date: 'February 2017',
      review:
        'My family and I visit Hawaii every year, and we usually book our flights through Tripma. Tripma was recommended to us by a long-time friend, and I\'m so glad we tried it out! The process was easy and reliable.',
      image: user2,
      rating: 4,
    },
    {
      name: 'Anthony Lewis',
      location: 'Berlin, Germany',
      date: 'September 2019',
      review:
        'When I was looking to book my flight to Berlin from LAX, Tripma had the best browsing experience, so I figured I\'d give it a try. It was my first time using Tripma, but I\'d definitely recommend it to a friend and use it for more trips!',
      image: user3,
      rating: 5,
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleToggle = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };


  return (
    <div>
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
      <section className="flight-deals">
        <h2 className="flight-deals-heading">Find your next adventure with these flight deals</h2>
        <div className="deals-container">
          {deals.map((deal, index) => (
            <div key={index} className="deal-card">
              <Image 
                src={deal.image} 
                alt={deal.city} 
                className="deal-image" 
                width={300}
                height={200}
                layout="responsive"
              />
              <div className="deal-info">
                <h3 className="deal-city">{deal.city}</h3>
                <p className="deal-location">{deal.location}</p>
                <p className="deal-description">{deal.description}</p>
                <p className="deal-price">${deal.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="places-to-stay">
      <h2>Explore unique places to stay</h2>
      <div className="places-container">
        {places.map((place, index) => (
          <div key={index} className="place-card">
            <Image 
              src={place.image} 
              alt={place.name} 
              className="place-image" 
              width={500}
              height={300}
              placeholder="blur"
              blurDataURL="/path/to/fallback/image.jpg"
            />
            <div className="place-info">
              <span className="place-name">{place.name}</span><br/>
              <p className="place-description">
                {place.description} 
              </p>
            </div>
          </div>
        ))}
      </div>
      </section>
      <section className="testimonials">
      <h2>What Tripma users are saying</h2>
      <div className="testimonial-cards">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <Image 
              src={testimonial.image} 
              alt={testimonial.name} 
              className="testimonial-image" 
              width={100}
              height={100}
            />
            <div className="testimonial-info">
              <h3 className="testimonial-name">{testimonial.name}</h3>
              <p className="testimonial-location">
                {testimonial.location} | {testimonial.date}
              </p>
              <div className="testimonial-rating">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} className="star">★</span>
                ))}
              </div>
              <p className={`testimonial-review ${expandedIndex === index ? 'expanded' : ''}`}>
                {testimonial.review}
              </p>
              <button onClick={() => handleToggle(index)} className="read-more-btn">
                {expandedIndex === index ? 'Read Less' : 'Read More'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
    </div>
  );
};

export default Home;

