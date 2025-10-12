import { headers } from 'next/headers'
import Link from 'next/link'
import MobileTabBar from '~/components/MobileTabBar'
import HeaderContainerDesktop from '~/container/desktop/header/Header.container'
import HeaderContainerMobile from '~/container/mobile/header/Header.container'
import { detectUserAgent } from '~/module/device.module'

export default function NotFound() {
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  return (
    <main
      className={
        isMobile
          ? 'w-full min-h-screen relative'
          : 'flex min-h-screen flex-col items-center justify-center'
      }
    >
      {isMobile ? <HeaderContainerMobile /> : <HeaderContainerDesktop />}
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
          404
        </h1>
        <h2
          className={`${isMobile ? 'text-[1.5rem]' : 'text-[2rem]'} mb-6 font-bold text-primary-3`}
        >
          페이지를 찾을 수 없습니다
        </h2>
        <strong
          className={`${isMobile ? 'text-[1.2rem]' : 'text-lg'} mb-8 text-primary-3 block`}
        >
          요청하신 페이지가 존재하지 않거나 잘못되었습니다.
        </strong>
        <Link
          href="/"
          className={`${isMobile ? 'w-1/2 mx-auto' : 'w-[15rem]'} text-[1.25rem] leading-[calc(3rem+2px)] text-white h-12 border-solid border-primary-4 border block`}
        >
          홈으로 돌아가기
        </Link>
      </div>
      {isMobile && <MobileTabBar />}
    </main>
  )
}
