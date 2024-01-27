import Navbar from './Navbar';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`max-w-screen-xl mx-auto ${inter.className}`}>
      <Navbar />
      {children}
    </div>
  );
}