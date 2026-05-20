import './globals.css';
import { Rajdhani, Space_Mono } from 'next/font/google';
import Navbar from '../components/layout/Navbar';

const rajdhani = Rajdhani({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-display',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata = {
  title: 'ARLON — Digital Culture & Limited Drops',
  description: 'Exclusive digital art, limited edition merch, and verified collectibles.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${spaceMono.variable}`}>
      <body className="bg-surface text-white font-body antialiased">
        {/* Scanline overlay for CRT effect */}
        <div className="scanlines" aria-hidden="true" />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
