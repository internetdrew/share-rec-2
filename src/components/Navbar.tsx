import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

const Navbar = () => {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    console.log(error);
  }

  return (
    <nav className='flex items-center justify-between py-4'>
      <Link href={'/'} className='text-2xl font-bold'>
        Let&apos;s Share Recipes
      </Link>
      <ul className='flex items-center gap-4 text-sm'>
        <li>
          <button onClick={handleSignOut}>Sign out</button>
        </li>
        <li>
          <Link href={'/login'}>Login</Link>
        </li>
        <li>
          <Link href={'/confirm'}>Create Account</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
