import LoginForm from '@/components/LoginForm';
import { getSupabaseServerClient } from '@/supabase/getSupabaseServerClient';
import { GetServerSidePropsContext } from 'next';

const Login = () => {
  return <LoginForm />;
};

export default Login;

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const supabase = getSupabaseServerClient(req, res);

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
