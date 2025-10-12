import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="text-center">
        <h1 className="mb-4 text-9xl font-bold text-slate-800">404</h1>
        <h2 className="mb-6 text-3xl font-bold text-slate-700">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="mb-8 text-lg text-slate-600">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-bold text-white transition-colors hover:bg-blue-700"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
