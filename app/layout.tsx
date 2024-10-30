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
  description: 'Your trusted travel partner',
  icons: {
    icon: [
      {
        url: '/favicon.ico',  // For traditional favicon
        sizes: 'any',
      },
      {
        url: '/icon.png',     // For modern browsers
        type: 'image/png',
        sizes: '32x32',
      }
    ],
    apple: [
      {
        url: '/apple-touch-icon.png', // For iOS devices
        sizes: '180x180',
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={nunitoSans.className}>
      <body className={nunitoSans.className}>
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