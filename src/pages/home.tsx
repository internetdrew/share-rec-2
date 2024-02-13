import { useQuery } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import { useEffect, useState } from 'react';
import { EditProfileModal } from '@/components/EditProfileModal';
import { createClient } from '@/utils/supabase/server-props';
import { createClient as componentClient } from '@/utils/supabase/components';
import { User } from '@supabase/supabase-js';

interface HomeProps {
  userId: string;
  email: string;
  displayName: string;
}

const Home = ({ user }: { user: User }) => {
  const [completeProfile, setCompleteProfile] = useState(false);
  const supabase = componentClient();

  const { data: profileData } = useQuery({
    queryKey: ['profile', user.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select()
        .eq('id', user.id);
      return data;
    },
  });

  useEffect(() => {
    if (profileData?.length) {
      setCompleteProfile(profileData?.length > 0);
    }
  }, [profileData?.length]);

  return (
    <>
      <div>
        <p>I am the home page for user {user.id}</p>
        <p>You can message them at {user.email}</p>
        <p>Call them {user.user_metadata.displayName} if you&apos;re nasty.</p>
      </div>
      {!completeProfile && (
        <EditProfileModal
          profileData={profileData}
          completeProfile={completeProfile}
        />
      )}
    </>
  );
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createClient(context);

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
