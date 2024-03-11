import Head from 'next/head';
import Navbar from './Navbar';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <>
      <Head>
        <title>Let&apos;s Share Recipes</title>
      </Head>
      <div className={`max-w-screen-xl mx-auto ${inter.className} px-4`}>
        <Navbar />
        {children}
      </div>
    </>
  );
}
