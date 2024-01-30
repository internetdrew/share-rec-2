import { useSupabaseBrowserClient } from '@/hooks/useSupabaseBrowserClient';
import { getSupabaseServerClient } from '@/supabase/getSupabaseServerClient';
import { useQuery } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import { useEffect, useState } from 'react';
import { EditProfileModal } from '@/components/EditProfileModal';

interface HomeProps {
  userId: string;
  email: string;
}

const Home = ({ userId, email }: HomeProps) => {
  const [completeProfile, setCompleteProfile] = useState(false);
  const supabase = useSupabaseBrowserClient();

  const { data: profileData } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select()
        .eq('id', userId);
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
        <p>I am the home page for user {userId}</p>
        <p>You can message them at {email}</p>
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

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const supabase = getSupabaseServerClient(req, res);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      userId: user?.id,
      email: user?.email,
    },
  };
}
