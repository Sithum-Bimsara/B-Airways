import HeroSection from './components/HeroSection';
import FlightDeals from './components/FlightDeals';
import PlacesToStay from './components/PlacesToStay';
import Testimonials from './components/Testimonials';

export default function Home() {
  return (
    <div className="flex flex-col space-y-8">
      <HeroSection />
      <FlightDeals />
      <PlacesToStay />
      <Testimonials />
    </div>
  );
}