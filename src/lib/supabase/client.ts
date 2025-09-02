// 클라이언트 컴포넌트에서 사용될 Supabase 클라이언트를 생성합니다.
// (예: 브라우저에서 사용자의 상호작용에 따라 데이터를 요청할 때)
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}