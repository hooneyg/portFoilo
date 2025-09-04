import { createClient } from '@/lib/supabase/server'
import { signOut } from './auth/actions'
import Link from 'next/link'
import ContactEmail from './component/ContactEmail' // 컴포넌트 import

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // --- 추가된 부분: 사용자 이름 표시 로직 ---
  let userName = 'Guest' // 기본값을 'Guest'로 설정
  if (user) {
    if (user.is_anonymous) {
      // 익명 사용자인 경우, 'Guest'를 유지
      userName = 'Guest'
    } else {
      // 소셜 로그인 시 제공되는 이름(user_metadata.full_name)을 우선적으로 사용하고,
      // 없으면 이메일을, 그것도 없으면 '사용자'를 표시합니다.
      userName = user.user_metadata.full_name || user.email || '사용자';
    }
  }
  // --- 여기까지 ---

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-900 text-white">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold">
          Welcome to{' '}
          <span className="text-indigo-400">
            Dev.Hooneyz Blog
          </span>
        </h1>

        <p className="mt-3 text-lg text-gray-300">
          기술과 경험을 기록하고 공유하는 공간입니다.
        </p>
        <ContactEmail />


        <div className="mt-12 flex flex-col items-center space-y-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <p className="text-gray-200">
                {/* --- 수정된 부분: userName 변수 사용 --- */}
                반갑습니다, <span className="font-semibold text-indigo-400">{userName}</span>님!
              </p>
              <form action={signOut}>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 transition-colors"
                >
                  로그아웃
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-6 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors"
            >
              로그인 페이지로 이동
            </Link>
          )}
        </div>
      </main>
    </div>
  )
}

