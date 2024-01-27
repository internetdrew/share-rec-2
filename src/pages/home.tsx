import { createBrowserClient } from '@supabase/ssr';

const Home = () => {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function getUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log(session?.user);

    const { data } = await supabase
      .from('profiles')
      .select()
      .eq('email', session?.user.email);
    console.log(data);
  }
  getUser();

  return <div>I am the home page for user</div>;
};

export default Home;
