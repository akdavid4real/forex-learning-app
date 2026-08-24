import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Environment } from '../config/env.ts';

export function createSupabaseClient(
  environment: Environment,
): SupabaseClient | null {
  if (!environment.SUPABASE_SERVICE_ROLE_KEY || !environment.SUPABASE_URL) {
    return null;
  }

  return createClient(
    environment.SUPABASE_URL,
    environment.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
