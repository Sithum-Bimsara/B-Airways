// components/PlacesToStay.jsx
import React from 'react';
import './PlacesToStay.css';
import maldivesImage from '../../assets/images/maldivesImage.jpg'; // Replace with your image path
import moroccoImage from '../../assets/images/moroccoImage.jpg';
import mongoliaImage from '../../assets/images/mongoliaImage.jpg';

function PlacesToStay() {
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

  return (
    <section className="places-to-stay">
      <h2>Explore unique places to stay</h2>
      <div className="places-container">
        {places.map((place, index) => (
          <div key={index} className="place-card">
            <img src={place.image} alt={place.name} className="place-image" />
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
  );
}

export default PlacesToStay;
