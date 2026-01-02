'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'

const MobileHeader = dynamic(
  () => import('~/container/mobile/header/Header.container'),
  { ssr: false },
)
const DesktopHeader = dynamic(
  () => import('~/container/desktop/header/Header.container'),
  { ssr: false },
)
const MobileTabBar = dynamic(() => import('~/components/MobileTabBar'), {
  ssr: false,
})

const Error = () => {
  // 클라이언트에서 user-agent 감지
  const isMobile =
    typeof window !== 'undefined'
      ? /mobile|android|iphone|ipad|ipod/i.test(navigator.userAgent)
      : false

  return (
    <main
      className={
        isMobile
          ? 'w-full min-h-screen relative'
          : 'flex min-h-screen flex-col items-center justify-center'
      }
    >
      {isMobile ? <MobileHeader /> : <DesktopHeader />}
      <div
        className={
          isMobile
            ? 'w-full text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
            : 'text-center'
        }
      >
        <h1
          className={`${isMobile ? 'text-[4rem]' : 'text-[6rem]'} mb-4 font-bold text-primary-3`}
        >
          500
        </h1>
        <h2
          className={`${isMobile ? 'text-[1.5rem]' : 'text-[2rem]'} mb-6 font-bold text-primary-3`}
        >
          에러가 발생했습니다!
        </h2>
        <p
          className={`${isMobile ? 'text-[1.2rem]' : 'text-lg'} mb-8 text-primary-3 block`}
        >
          <strong className="block">일시적인 오류가 발생했습니다.</strong>
          잠시 후 다시 시도해주세요.
        </p>
        <Link
          href="/"
          className={`${isMobile ? 'w-1/2 mx-auto' : 'w-[15rem]'} text-[1.25rem] text-aligned-xl text-white h-12 border-solid border-primary-4 border block`}
        >
          홈으로 돌아가기
        </Link>
      </div>
      {isMobile && <MobileTabBar />}
    </main>
  )
}

export default Error
