import { getSupabaseApiClient } from '@/utils/supabase/api';
import { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  isAvailable?: boolean;
  error?: {
    code: number;
    message: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { username } = req.query;
  try {
    if (!username) throw new Error('Username parameter missing in request.');

    const supabase = getSupabaseApiClient(req, res);
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username!);

    res.status(200).json({ isAvailable: data?.length === 0 });
  } catch (err) {
    res.status(400).json({
      error: {
        code: 400,
        message: 'Username parameter is missing in the request.',
      },
    });
  }
}
