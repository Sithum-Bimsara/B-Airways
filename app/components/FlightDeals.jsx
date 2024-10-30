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
      description: 'Marvel at this grand temple’s glowing splendor by night.',
      image: ancientCitySingapore,
    },
    {
      city: 'Lempuyang Temple',
      location: 'Bali, Indonesia',
      description: 'Step through the Gates of Heaven with stunning Mount Agung views.',
      image: empuyangTempleBali,
    },
    {
      city: 'Marina Bay & Helix Bridge',
      location: 'Singapore',
      description: 'Experience the dazzling skyline from Singapore’s iconic landmarks.',
      image: helixBaySingapore,
    },
    {
      city: 'Lotus Tower',
      location: 'Colombo, Sri Lanka',
      description: 'Ascend South Asia’s tallest tower for panoramic city views.',
      image: lotusTowerSL,
    },
    {
      city: 'Nusa Penida Island',
      location: 'Bali, Indonesia',
      description: 'Explore turquoise waters, towering cliffs, and hidden beaches.',
      image: nusaPenidaIslandBali,
    },
    {
      city: 'Sigiriya Rock Fortress',
      location: 'Sri Lanka',
      description: 'Scale the ancient fortress for breathtaking jungle views.',
      image: sigiriya,
    },
    {
      city: 'Taj Mahal',
      location: 'Agra, India',
      description: 'Witness the timeless beauty of this symbol of eternal love.',
      image: tajMahalIndia,
    },
    {
      city: 'Wat Benchamabophit Temple',
      location: 'Bangkok, Thailand',
      description: 'Admire the Marble Temple’s elegance under twilight hues.',
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
