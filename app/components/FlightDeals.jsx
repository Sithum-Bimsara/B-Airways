// components/FlightDeals.jsx
import React from 'react';
import Image from 'next/image';
import sydneyImage from '../assets/images/sydney.jpg';
import kodaijiImage from '../assets/images/kodaiji.jpg';
import './FlightDeals.css';

function FlightDeals() {
  const deals = [
    {
      city: 'Sydney Opera House',
      location: 'Sydney',
      description: 'Take a stroll along the famous harbor',
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
      image: sydneyImage, 
    },
    {
      city: 'Kōdaiji Temple',
      location: 'Kyoto',
      description: 'Step back in time in the Gion district',
      image: kodaijiImage,
    },
  ];

  return (
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
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FlightDeals;
