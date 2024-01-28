import { type EmailOtpType } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseServerClient } from '@/supabase/getSupabaseServerClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = `${process.env.SITE_URL}${req.url}`;
  const { searchParams } = new URL(url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';

  if (token_hash && type) {
    const supabase = getSupabaseServerClient(req, res);

    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    });

    if (!error) {
      return res.redirect(next);
    } else {
      return res.redirect('/auth/error');
    }
  }
}
