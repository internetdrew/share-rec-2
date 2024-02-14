import CreateAccountForm from '@/components/CreateAccountForm';
import { getSupabaseServerPropsClient } from '@/utils/supabase/server-props';
import { GetServerSidePropsContext } from 'next';

export default function Home() {
  return (
    <main>
      <header className='text-center max-w-4xl mt-16 mx-auto'>
        <h1 className='text-3xl font-bold md:text-5xl'>
          Share your favorite recipes, effortlessly!{' '}
        </h1>
        <p className='text-lg mt-4 text-gray-800 max-w-2xl mx-auto'>
          Share recipes with friends, modify recipes from others, and never have
          to ask Mom how to make her lasagna ever again.
        </p>
      </header>
      <section className='mt-10'>
        <CreateAccountForm />
      </section>
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = getSupabaseServerPropsClient(context);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return {
      redirect: {
        destination: '/home',
      },
    };
  }

  return {
    props: {},
  };
}
