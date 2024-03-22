import { type EmailOtpType } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

import { getSupabaseApiClient } from '@/utils/supabase/api';

function stringOrFirstString(item: string | string[] | undefined) {
  return Array.isArray(item) ? item[0] : item;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).appendHeader('Allow', 'GET').end();
    return;
  }
  const queryParams = req.query;
  const token_hash = stringOrFirstString(queryParams.token_hash);
  const type = stringOrFirstString(queryParams.type);

  if (token_hash && type) {
    const supabase = getSupabaseApiClient(req, res);
    const { data: authData, error } = await supabase.auth.verifyOtp({
      type: type as EmailOtpType,
      token_hash,
    });

    if (error || !authData) {
      res.redirect('/error');
    }

    const userId = authData?.user?.id!;
    const email = authData?.user?.email!;
    const confirmedAt = authData?.user?.confirmed_at;
    const { displayName, username } =
      authData?.user?.user_metadata?.displayName;

    const { data: profileData } = await supabase
      .from('profiles')
      .select()
      .eq('id', userId);
    console.log(profileData);

    if (!profileData?.length) {
      const { data, error } = await supabase.from('profiles').insert({
        id: userId,
        email: email,
        created_at: confirmedAt,
        display_name: displayName,
        username: username,
      });

      if (error) {
        res.redirect('/error');
      }
    }

    res.redirect('/home');
  }
}
