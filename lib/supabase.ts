import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { MergeDeep } from 'type-fest';
import { Database as SupabaseDatabase } from '@/database.types';

type Database = MergeDeep<SupabaseDatabase, Record<string, never>>;

export const client = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const ssrClient = (request: NextRequest) => {
  const headers = new Headers();
  let supabaseResponse = NextResponse.next({
    request,
  });
  const serverSideClient = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );
  return {
    client: serverSideClient,
    headers,
  };
};
