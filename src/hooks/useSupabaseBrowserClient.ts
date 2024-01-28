import { useMemo } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';

function getSupabaseBrowserClient() {
  const client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return client;
}

export function useSupabaseBrowserClient() {
  return useMemo(getSupabaseBrowserClient, []);
}
