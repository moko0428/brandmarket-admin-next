import {
  createBrowserClient,
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr';
import { NextRequest } from 'next/server';
import { MergeDeep } from 'type-fest';
import { Database as SupabaseDatabase } from '@/database.types';

type Database = MergeDeep<SupabaseDatabase, Record<string, never>>;

export const client = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const ssrClient = (request: NextRequest) => {
  const headers = new Headers();
  const serverSideClient = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          try {
            const cookies = parseCookieHeader(
              request.headers.get('Cookie') ?? ''
            );
            return cookies.map(({ name, value }) => ({
              name,
              value: value ?? '',
            }));
          } catch (error) {
            console.error('supabase: 쿠키 파싱 중 오류 발생:', error);
            return [];
          }
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              headers.append(
                'Set-Cookie',
                serializeCookieHeader(name, value, options)
              );
            } catch (error) {
              console.error(`supabase: 쿠키 설정 중 오류 발생: ${name}`, error);
            }
          });
        },
      },
    }
  );
  return {
    client: serverSideClient,
    headers,
  };
};
