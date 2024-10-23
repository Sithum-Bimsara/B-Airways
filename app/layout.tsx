import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './layout.css'; // Ensure you have a layout.css or similar for global styles

export const metadata = {
  title: 'B Airways',
  description: 'Your journey starts here',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen overflow-x-hidden"> {/* Prevent horizontal scrolling */}
        <Navbar />
        <main className="flex-grow container mx-auto px-4" style={{ paddingTop: '80px', paddingBottom: '60px' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}