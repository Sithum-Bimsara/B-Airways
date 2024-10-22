// App.jsx
import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './pages/Home/HeroSection';
import FlightDeals from './pages/Home/FlightDeals';
import PlacesToStay from './pages/Home/PlacesToStay';
import Testimonials from './pages/Home/Testimonials';
import Footer from './components/Footer';
import './App.css';


function App() {
  return (
    <div className="App">
      <Navbar />
      <HeroSection />
      <FlightDeals />
      <PlacesToStay />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default App;

