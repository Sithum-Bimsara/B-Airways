import styles from './page.module.css';
import HeroSection from './components/HeroSection';
import FlightDeals from './components/FlightDeals';
import PlacesToStay from './components/PlacesToStay';
import Testimonials from './components/Testimonials';

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      <HeroSection />
      <FlightDeals />
      <PlacesToStay />
      <Testimonials />
    </div>
  );
}