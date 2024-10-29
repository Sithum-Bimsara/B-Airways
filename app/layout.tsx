import './layout.css';
import styles from './layout.module.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthProvider from './context/AuthContext';

export const metadata = {
  title: 'B Airways',
  description: 'Your journey starts here',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className={styles.pageWrapper}>
            <Navbar />
            <main className={styles.mainContent}>
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}