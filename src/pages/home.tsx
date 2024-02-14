import { useQuery } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import { EditProfileModal } from '@/components/EditProfileModal';
import { getSupabaseServerPropsClient } from '@/utils/supabase/server-props';
import { getSupabaseBrowserClient } from '@/utils/supabase/components';
import { User } from '@supabase/supabase-js';

const Home = ({ user }: { user: User }) => {
  const supabase = getSupabaseBrowserClient();

  const { data: profileData, isFetching } = useQuery({
    queryKey: ['profile', user.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select()
        .eq('id', user.id);
      return data;
    },
  });

  const userProfile = profileData?.[0];

  return (
    <>
      <div>
        <p>I am the home page for user {user.id}</p>
        <p>You can message them at {user.email}</p>
        <p>Call them {user.user_metadata.displayName} if you&apos;re nasty.</p>
      </div>
      {!isFetching && !userProfile && (
        <EditProfileModal profileData={userProfile} email={user.email!} />
      )}
    </>
  );
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = getSupabaseServerPropsClient(context);

  const { data, error } = await supabase.auth.getUser();

  if (error || !data) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: data.user,
    },
  };
}
