'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅 (필요시 Sentry 등 연동)
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="text-center">
        <h1 className="mb-4 text-9xl font-bold text-slate-800">500</h1>
        <h2 className="mb-6 text-3xl font-bold text-slate-700">
          문제가 발생했습니다
        </h2>
        <p className="mb-8 text-lg text-slate-600">
          일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-bold text-white transition-colors hover:bg-blue-700"
          >
            다시 시도
          </button>
          <a
            href="/"
            className="inline-block rounded-lg bg-slate-600 px-8 py-3 font-bold text-white transition-colors hover:bg-slate-700"
          >
            홈으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  )
}
