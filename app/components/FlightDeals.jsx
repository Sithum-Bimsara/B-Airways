// components/FlightDeals.jsx
import React from 'react';
import Image from 'next/image';
import ancientCitySingapore from '../assets/images/ancientCitySingapore.jpg';
import empuyangTempleBali from '../assets/images/empuyangTempleBali.jpg';
import helixBaySingapore from '../assets/images/helixBaySingapore.jpg';
import lotusTowerSL from '../assets/images/lotusTowerSL.jpg';
import nusaPenidaIslandBali from '../assets/images/nusaPenidaIslandBali.jpg';
import sigiriya from '../assets/images/sigiriya.jpg';
import tajMahalIndia from '../assets/images/tajMahalIndia.jpg';
import watBenchamabophitTemple from '../assets/images/WatBenchamabophitTempleinBangkokThailand.jpg';


import './FlightDeals.css';

function FlightDeals() {
  const deals = [
    {
      city: 'Buddha Tooth Relic Temple',
      location: 'Singapore',
      description: 'Discover the beautiful architecture of this Chinese Buddhist temple at night.',
      image: ancientCitySingapore,
    },
    {
      city: 'Lempuyang Temple',
      location: 'Bali, Indonesia',
      description: 'Experience the Gates of Heaven with the majestic Mount Agung in the background.',
      image: empuyangTempleBali,
    },
    {
      city: 'Marina Bay & Helix Bridge',
      location: 'Singapore',
      description: 'Enjoy the breathtaking skyline view from this architectural wonder by night.',
      image: helixBaySingapore,
    },
    {
      city: 'Lotus Tower',
      location: 'Colombo, Sri Lanka',
      description: 'Explore the tallest tower in South Asia with panoramic views of the city.',
      image: lotusTowerSL,
    },
    {
      city: 'Nusa Penida Island',
      location: 'Bali, Indonesia',
      description: 'Discover the turquoise waters and cliffs of this idyllic paradise.',
      image: nusaPenidaIslandBali,
    },
    {
      city: 'Sigiriya Rock Fortress',
      location: 'Sri Lanka',
      description: 'Climb the ancient rock fortress for a stunning panoramic view of the jungle.',
      image: sigiriya,
    },
    {
      city: 'Taj Mahal',
      location: 'Agra, India',
      description: 'Marvel at the symbol of love, a UNESCO World Heritage Site.',
      image: tajMahalIndia,
    },
    {
      city: 'Wat Benchamabophit Temple',
      location: 'Bangkok, Thailand',
      description: 'Admire the marble architecture of this beautiful Thai temple during twilight.',
      image: watBenchamabophitTemple,
    },
  ];
  
  

  return (
    <section className="flight-deals">
      <h2 className="flight-deals-heading">Your Dream Destinations Await - Fly with Us!</h2>
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
