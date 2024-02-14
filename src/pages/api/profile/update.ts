import { getSupabaseApiClient } from '@/utils/supabase/api';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res
      .status(400)
      .json({ messge: `${req.method} method not allowed on this route.` });
  }
  const { displayName, username, email } = JSON.parse(req.body);

  const supabase = getSupabaseApiClient(req, res);
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    res.status(401).json({ messge: 'You are not authorized for this action.' });
  }

  const { error } = await supabase
    .from('profiles')
    .insert({ id: user?.id!, display_name: displayName, email, username })
    .select();

  if (error) {
    res.status(500).json({ message: 'Error creating new profile.' });
  } else {
    res.status(200).json({ message: 'hell yeahs' });
  }
}
