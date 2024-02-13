import { getSupabaseBrowserClient } from '@/utils/supabase/components';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = () => {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
  });

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.reload();
  }

  return (
    <nav className='flex items-center justify-between py-4'>
      <Link href={'/'} className='text-2xl font-bold'>
        Let&apos;s Share Recipes
      </Link>
      <ul className='flex items-center gap-4 text-sm'>
        {userData ? (
          <li>
            <button onClick={handleSignOut} className='btn-secondary'>
              Sign out
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link href={'/login'} className='btn-secondary'>
                Login
              </Link>
            </li>
            <li>
              <Link href={'/'} className='btn-primary'>
                Sign up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
