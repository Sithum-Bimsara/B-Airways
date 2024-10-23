// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './pages/Home/HeroSection';
import FlightDeals from './pages/Home/FlightDeals';
import PlacesToStay from './pages/Home/PlacesToStay';
import Testimonials from './pages/Home/Testimonials';
import Footer from './components/Footer';
import SearchResults from './pages/SearchResults/SearchResults';
import './App.css';

function HomePage() {
  return (
    <>
      <HeroSection />
      <FlightDeals />
      <PlacesToStay />
      <Testimonials />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/SearchResults" element={<SearchResults />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;