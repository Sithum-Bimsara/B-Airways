import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './layout.css';
import AuthProvider from './context/AuthContext';

export const metadata = {
  title: 'B Airways',
  description: 'Your journey starts here',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen overflow-x-hidden">
        <AuthProvider>
          <Navbar />
          <main>
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}