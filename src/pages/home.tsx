import { useQuery } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import { EditProfileModal } from '@/components/EditProfileModal';
import { getSupabaseServerPropsClient } from '@/utils/supabase/server-props';
import { getSupabaseBrowserClient } from '@/utils/supabase/components';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/router';

const Home = ({ user }: { user: User }) => {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  const { data: profileData, isFetching } = useQuery({
    queryKey: ['fetchProfile', user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', user.id);

      const profile = data?.[0];

      if (error || !profile) {
        router.push('/');
      }

      if (profile) {
        const { display_name, avatar_url, created_at, ...everythingElse } =
          profile;

        return {
          ...everythingElse,
          displayName: display_name,
          avatarUrl: avatar_url,
          createdAt: created_at,
        };
      }
    },
  });

  return (
    <>
      <div>
        <p>I am the home page for user {profileData?.id}</p>
        <p>You can message them at {profileData?.email}</p>
        <p>Call them {profileData?.displayName} if you&apos;re nasty.</p>
      </div>
      {!isFetching && !profileData && (
        <EditProfileModal
          profileData={profileData}
          email={user.email!}
          displayName={user?.user_metadata?.displayName}
          username={user?.user_metadata?.username}
        />
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
