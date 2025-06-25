import { createServerClient } from '@supabase/ssr';
import { MergeDeep } from 'type-fest';
import { Database as SupabaseDatabase } from '@/database.types';
import { cookies } from 'next/headers';

export type Database = MergeDeep<SupabaseDatabase, Record<string, never>>;

export async function serverClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
