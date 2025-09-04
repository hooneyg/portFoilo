'use client' // 클라이언트 컴포넌트로 선언

import { useState } from 'react'

export default function ContactEmail() {
  const [copied, setCopied] = useState(false)
  const email = 'hooney1982@gmail.com'

  const handleCopy = () => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true)
      // 2초 후에 메시지를 원래대로 되돌립니다.
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="mt-8">
      <p className="text-gray-400">홈페이지 제작 문의</p>
      <div 
        onClick={handleCopy}
        className="mt-2 flex items-center justify-center p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
      >
        <span className="font-mono text-indigo-400">{email}</span>
        <button 
          className="ml-4 px-3 py-1 text-sm bg-gray-600 rounded-md"
        >
          {copied ? '복사 완료!' : '주소 복사'}
        </button>
      </div>
    </div>
  )
}