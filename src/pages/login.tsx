import LoginForm from '@/components/LoginForm';
import { createClient } from '@/utils/supabase/server-props';
import { GetServerSidePropsContext } from 'next';

const Login = () => {
  return <LoginForm />;
};

export default Login;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createClient(context);

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
