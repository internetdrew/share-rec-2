import { useSupabaseBrowserClient } from '@/hooks/useSupabaseBrowserClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = () => {
  const supabase = useSupabaseBrowserClient();
  const router = useRouter();
  const { data: sessionData } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data;
    },
  });

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  return (
    <nav className='flex items-center justify-between py-4'>
      <Link href={'/'} className='text-2xl font-bold'>
        Let&apos;s Share Recipes
      </Link>
      <ul className='flex items-center gap-4 text-sm'>
        {sessionData?.session && (
          <li>
            <button onClick={handleSignOut}>Sign out</button>
          </li>
        )}
        <li>
          <Link href={'/login'}>Login</Link>
        </li>
        <li>
          <Link href={'/confirm'} className='btn-primary'>
            Create Account
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
