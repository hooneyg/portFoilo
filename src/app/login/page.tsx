'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import HCaptcha from '@hcaptcha/react-hcaptcha';

const Eye = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOff = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FEE500"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    <path d="M1 1h22v22H1z" fill="none"/>
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')

  // --- CAPTCHA를 위한 state와 ref 추가 ---
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [guestLoginClicked, setGuestLoginClicked] = useState(false); 
  // const captchaRef = useRef<HCaptcha>(null);
  // --------------------------------------
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // captchaToken이 null이 아닌 유효한 값으로 변경되었을 때만 실행
    if (captchaToken) {
      const performSignIn = async () => {
        setMessage(''); // 이전 메시지 초기화
        const { error } = await supabase.auth.signInAnonymously({
            options: { captchaToken },
        });
        
        if (error) {
          setMessage('게스트 로그인에 실패했습니다: ' + error.message);
          setCaptchaToken(null); // 실패 시 토큰 리셋
        } else {
          router.push('/');
          router.refresh();
        }
      };

      performSignIn();
    }
  }, [captchaToken, router, supabase]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage('')
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setMessage('이메일 또는 비밀번호가 일치하지 않습니다.')
      return
    }
    router.push('/')
    router.refresh()
  }

  const handleSignUp = async () => {
    setMessage('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/confirm`,
      },
    })
    if (error) {
      setMessage('회원가입 중 오류가 발생했습니다: ' + error.message)
      return
    }
    setMessage('가입 확인을 위해 이메일을 발송했습니다. 메일함을 확인해주세요.')
  }
  
  const handleSignInWithOAuth = async (provider: 'google') => {
    setMessage('');
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/confirm`,
      },
    });
  }

  // const handleSignInAnonymously = async() => {
  //   // 캡차 토큰이 있는지 먼저 확인
  //   if (!captchaToken) {
  //     setMessage('CAPTCHA 인증을 완료해주세요.');
  //     return;
  //   }
    
  //   setMessage('');
  //   const { error } = await supabase.auth.signInAnonymously({
  //       options: { captchaToken },
  //   });
    
  //   if (error) {
  //     setMessage('게스트 로그인에 실패했습니다: ' + error.message);
  //     setCaptchaToken(null);
  //   } else {
  //     router.push('/');
  //     router.refresh();
  //   }
  // };

  // 캡차가 성공적으로 완료되면 토큰을 저장하는 함수
  const onCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
    console.log("CAPTCHA verified, token:", token);
    // handleSignInAnonymously();
  };
  
  // 캡차가 만료되면 토큰을 리셋하는 함수
  const onCaptchaExpire = () => {
    setCaptchaToken(null);
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="w-full max-w-sm p-8 space-y-6 bg-gray-800 rounded-lg shadow-xl">
        
        <h1 className="text-2xl font-bold text-center text-white">Dev.Hooney's Blog</h1>

        <div className="flex flex-col space-y-2">
          <button
            onClick={() => handleSignInWithOAuth('google')}
            className="flex items-center justify-center w-full px-4 py-2 font-medium text-gray-700 bg-white rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors cursor-pointer"
          >
            <GoogleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>Google 로그인</span>
          </button>
          {/* <button
            onClick={() => handleSignInWithOAuth('kakao')}
            className="flex items-center justify-center w-full px-4 py-2 font-medium text-black bg-[#FEE500] rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors cursor-pointer"
          >
            <img 
              src="https://developers.kakao.com/tool/resource/static/img/button/kakaotalksharing/kakaotalk_sharing_btn_medium.png" 
              alt="카카오 공유 버튼" 
              className="h-6" // 이미지 높이 기준으로 크기 조정
            />
            <span className="ml-2">카카오 로그인</span>
          </button> */}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800 text-gray-400">또는</span>
          </div>
        </div>
        
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              이메일 주소
            </label>
            <input
              id="email" name="email" type="email" required
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              비밀번호
            </label>
            <div className="relative">
              <input
                id="password" name="password" type={showPassword ? 'text' : 'password'}
                required
                className="w-full px-3 py-2 pr-10 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <div className="flex flex-col space-y-2 pt-2">
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors cursor-pointer"
            >
              이메일로 로그인
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              className="w-full px-4 py-2 font-semibold text-indigo-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors cursor-pointer"
            >
              이메일로 회원가입
            </button>
          </div>
        </form>
        
        <div className="text-center">
            {!guestLoginClicked ? (
                <button
                    type="button"
                    onClick={() => setGuestLoginClicked(true)}
                    className="text-sm text-gray-400 hover:text-white hover:underline transition-colors"
                >
                    둘러보기 (게스트)
                </button>
            ) : (
                <div className="flex flex-col items-center space-y-4">
                    <p className="text-sm text-gray-300">봇이 아님을 증명해주세요.</p>
                    <HCaptcha
                      sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
                      onVerify={onCaptchaVerify}
                      onExpire={onCaptchaExpire}
                      theme="dark" // 어두운 테마 적용
                    />
                </div>
            )}
        </div>

        {message && <p className="mt-4 text-center text-sm text-yellow-300">{message}</p>}
      </div>
    </div>
  )
}

