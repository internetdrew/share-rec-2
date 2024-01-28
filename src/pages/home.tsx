import { getSupabaseServerClient } from '@/supabase/getSupabaseServerClient';
import { GetServerSidePropsContext } from 'next';

interface HomeProps {
  userId: string;
  email: string;
}

const Home = ({ userId, email }: HomeProps) => {
  console.log(userId);
  console.log(email);

  return (
    <div>
      <p>I am the home page for user {userId}</p>
      <p>You can message them at {email}</p>
    </div>
  );
};

export default Home;

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const supabase = getSupabaseServerClient(req, res);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      userId: user.id,
      email: user.email,
    },
  };
}
