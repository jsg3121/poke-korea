'use client'

import Link from 'next/link'

const Error = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full px-4 text-center desktop:px-0">
        <h1 className="text-[4rem] desktop:text-[6rem] mb-4 font-bold text-primary-3">
          500
        </h1>
        <h2 className="text-2xl desktop:text-[2rem] mb-6 font-bold text-primary-3">
          에러가 발생했습니다!
        </h2>
        <p className="text-[1.2rem] desktop:text-lg mb-8 text-primary-3 block">
          <strong className="block">일시적인 오류가 발생했습니다.</strong>
          잠시 후 다시 시도해주세요.
        </p>
        <Link
          href="/"
          className="w-1/2 desktop:w-[15rem] mx-auto text-xl text-aligned-xl text-white h-12 border-solid border-primary-4 border block"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}

export default Error
