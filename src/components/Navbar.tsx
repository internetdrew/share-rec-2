import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className='flex items-center justify-between py-4'>
      <Link href={'/'} className='text-2xl font-bold'>
        Let&apos;s Share Recipes
      </Link>
      <ul className='flex items-center gap-4 text-sm'>
        <li>
          <Link href={'/login'}>Login</Link>
        </li>
        <li>
          <Link href={'/create-account'}>Create Account</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
