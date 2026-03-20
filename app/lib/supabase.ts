import { createClient } from '@supabase/supabase-js';

// 환경 변수에서 URL과 KEY를 불러옵니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Supabase 클라이언트를 생성하고 내보냅니다.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);