import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type EmailOtpType } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import { Database } from '@/types/supabase';
import { NextRequest, NextResponse } from 'next/server';

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
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies[name];
          },
          set(name: string, value: string, options: CookieOptions) {
            const cookie = [`${name}=${value}`];
            res.setHeader('Set-Cookie', cookie);
          },
          remove(name: string, options: CookieOptions) {
            const cookie = [
              `${name}=`,
              'expires=Thu, 01 Jan 1970 00:00:00 GMT',
            ];
            res.setHeader('Set-Cookie', cookie);
          },
        },
      }
    );

    const refreshToken = req.cookies['my-refresh-token'];
    const accessToken = req.cookies['my-access-token'];

    if (refreshToken && accessToken) {
      await supabase.auth.setSession({
        refresh_token: refreshToken,
        access_token: accessToken,
      });
    } else {
      throw new Error('User is not authenticated.');
    }
    await supabase.auth.getUser();

    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    });

    if (!error) {
      return res.redirect(next);
    } else {
    }
  }
}
