import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Nunito_Sans } from 'next/font/google'
import './layout.css';
import AuthProvider from './context/AuthContext';

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700']
})

export const metadata = {
  title: 'B Airways',
  description: 'Your journey starts here',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={nunitoSans.className}>
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