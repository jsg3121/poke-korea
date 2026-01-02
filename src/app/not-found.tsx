import { headers } from 'next/headers'
import Link from 'next/link'
import { Metadata } from 'next'
import MobileTabBar from '~/components/MobileTabBar'
import HeaderContainerDesktop from '~/container/desktop/header/Header.container'
import HeaderContainerMobile from '~/container/mobile/header/Header.container'
import { detectUserAgent } from '~/module/device.module'
import ImageComponent from '~/components/Image.component'
import { imageMode } from '~/module/buildMode'

export const metadata: Metadata = {
  title: '404 - 페이지를 찾을 수 없습니다 | 포케 코리아',
  description: '요청하신 페이지가 존재하지 않거나 잘못되었습니다.',
  robots: {
    index: false,
    follow: true,
  },
}

const NotFound = () => {
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
          className={`${isMobile ? 'text-2xl' : 'text-[2rem]'} mb-6 font-bold text-primary-3`}
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
          className={`${isMobile ? 'w-1/2 mx-auto' : 'w-[15rem]'} text-xl text-aligned-xl text-white h-12 border-solid border-primary-4 border block mb-12`}
        >
          홈으로 돌아가기
        </Link>
        <div className={`${isMobile ? 'px-4' : ''}`}>
          <p
            className={`${isMobile ? 'text-base' : 'text-lg'} text-primary-3 mb-4 font-medium`}
          >
            인기 포켓몬 보러가는건 어때요?
          </p>
          <div
            className={`flex ${isMobile ? 'flex-wrap justify-center' : ''} gap-3 justify-center`}
          >
            <Link href="/detail/25">
              <ImageComponent
                height="10rem"
                width="10rem"
                src={`${imageMode}/25.webp?w=200&h=200`}
              />
              <p className="px-4 h-10 bg-primary-2 text-primary-4 rounded-lg hover:bg-primary-3 hover:text-primary-1 text-aligned-lg transition-colors">
                피카츄
              </p>
            </Link>
            <Link href="/detail/6">
              <ImageComponent
                height="10rem"
                width="10rem"
                src={`${imageMode}/6.webp?w=200&h=200`}
              />
              <p className="px-4 h-10 bg-primary-2 text-primary-4 rounded-lg hover:bg-primary-3 hover:text-primary-1 text-aligned-lg transition-colors">
                리자몽
              </p>
            </Link>
            <Link href="/detail/133">
              <ImageComponent
                height="10rem"
                width="10rem"
                src={`${imageMode}/133.webp?w=200&h=200`}
              />
              <p className="px-4 h-10 bg-primary-2 text-primary-4 rounded-lg hover:bg-primary-3 hover:text-primary-1 text-aligned-lg transition-colors">
                이브이
              </p>
            </Link>
            <Link href="/detail/150">
              <ImageComponent
                height="10rem"
                width="10rem"
                src={`${imageMode}/150.webp?w=200&h=200`}
              />
              <p className="px-4 h-10 bg-primary-2 text-primary-4 rounded-lg hover:bg-primary-3 hover:text-primary-1 text-aligned-lg transition-colors">
                뮤츠
              </p>
            </Link>
          </div>
        </div>
      </div>
      {isMobile && <MobileTabBar />}
    </main>
  )
}

export default NotFound
