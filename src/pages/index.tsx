import Image from 'next/image';
import { createBrowserClient } from '@supabase/ssr';
import { useEffect } from 'react';

export default function Home() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log(session);
    };
    fetchSession();
  }, [supabase]);

  return (
    <main>
      <header className='text-center max-w-4xl mt-16 mx-auto md:mt-28'>
        <h1 className='text-3xl font-bold md:text-5xl'>
          Share your best recipes, effortlessly!{' '}
        </h1>
        <p className='text-lg mt-4 text-gray-800 max-w-2xl mx-auto'>
          Share recipes with friends, customize family recipes, and never have
          to call Mom to make her lasagna ever again.
        </p>
      </header>
    </main>
  );
}
