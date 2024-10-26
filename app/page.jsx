// import HeroSection from './components/HeroSection';
// import FlightDeals from './components/FlightDeals';
// import PlacesToStay from './components/PlacesToStay';
// import Testimonials from './components/Testimonials';
import AdminPanel from './adminpanel/adminpanel';

export default function Home() {
  return (
    <div className="flex flex-col space-y-8">
      <AdminPanel/>
      {/* <HeroSection/>
      <FlightDeals/>
      <PlacesToStay/>
      <Testimonials/> */}
    </div>
  );
}