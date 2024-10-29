// components/FlightDeals.jsx
import React from 'react';
import Image from 'next/image';
import sydneyImage from '../assets/images/sydney.jpg';
import kodaijiImage from '../assets/images/kodaiji.jpg';
import tajmahalImage from '../assets/images/Taj_Mahal.jpeg';
import libertyImage from '../assets/images/liberty.jpg'
import './FlightDeals.css';

function FlightDeals() {
  const deals = [
    {
      city: 'Sydney Opera House',
      location: 'Sydney',
      description: 'Take a stroll along the famous harbor',
      price: 981,
      image: sydneyImage,
    },

    {
      city: 'Taj Mahal',
      location: 'India',
      description: 'An iconic symbol of love',
      price: 255,
      image: tajmahalImage, 
    },
    
    {
      city: 'Kōdaiji Temple',
      location: 'Kyoto',
      description: 'Step back in time in the Gion district',
      price: 633,
      image: kodaijiImage,
    },
    
    {
      city: 'Statue of Liberty',
      location: 'New York',
      description: 'An iconic symbol of freedom ',
      price: 500,
      image: libertyImage,
    },
  ];

  return (
    <section id="flights" className="flight-deals">
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
  );
}

export default FlightDeals;