import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const code = searchParams.get('code') // OAuth를 위한 인증 코드
  const next = searchParams.get('next') ?? '/'

  const redirectTo = (path: string, message?: string) => {
    const url = new URL(path, request.url)
    if (message) {
      url.searchParams.set('message', message)
    }
    return NextResponse.redirect(url)
  }

  // 이메일 링크 인증 처리
  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    })
    if (!error) {
      return redirectTo(next)
    }
  }

  // OAuth 인증 처리 (구글, 카카오 등)
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return redirectTo(next)
    }
  }

  // 두 경우 모두 실패 시 에러 메시지와 함께 리디렉션
  return redirectTo('/login', '인증에 실패했습니다. 다시 시도해주세요.')
}

