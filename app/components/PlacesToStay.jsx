// components/PlacesToStay.jsx
import React from 'react';
import './PlacesToStay.css';

import anantaraPeaceHavenImage from '../assets/images/AnantaraPeaceHaven.jpg';
import nottingHillApartmentsBaliResortImage from '../assets/images/NottingHillApartmentsBaliResort.jpg';
import santhiyaTreeKohChangResortImage from '../assets/images/SanthiyaTreeKohChangResort,KohChang.jpeg';
import Image from 'next/image';

function PlacesToStay() {
  const places = [
    { 
      name: 'Anantara Peace Haven, Sri Lanka', 
      description: `Escape to a beachfront paradise on Sri Lanka’s southern coast. 
                    Surrounded by coconut groves, this luxurious resort offers private 
                    pool villas, a two-level infinity pool, and vibrant dining experiences.`,
      image: anantaraPeaceHavenImage 
    },
    { 
      name: 'Notting Hill Apartments Bali Resort, Indonesia', 
      description: `Unwind in Bali’s tropical beauty at this resort nestled among lush greenery. 
                    Experience modern luxury with spacious apartments, an infinity pool overlooking 
                    the ocean, and easy access to vibrant beaches and local attractions.`,
      image: nottingHillApartmentsBaliResortImage 
    },
    { 
      name: 'Santhiya Tree Koh Chang Resort, Thailand', 
      description: `Immerse yourself in tropical bliss at this eco-luxury resort on Koh Chang Island. 
                    Relax in teakwood villas with private pools, indulge in spa treatments, and enjoy 
                    breathtaking views of the sea.`,
      image: santhiyaTreeKohChangResortImage 
    },
  ];


  return (
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
  );
}

export default PlacesToStay;
