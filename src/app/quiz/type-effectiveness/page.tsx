import { Metadata } from 'next'
import { headers } from 'next/headers'
import { Fragment } from 'react'
import FooterDesktop from '~/container/desktop/footer/Footer.container'
import HeaderDesktop from '~/container/desktop/header/Header.container'
import FooterMobile from '~/container/mobile/footer/Footer.container'
import HeaderMobile from '~/container/mobile/header/Header.container'
import { TypeEffectivenessQuizProvider } from '~/context/TypeEffectivenessQuiz.context'
import { detectUserAgent } from '~/module/device.module'
import TypeEffectivenessQuizDesktop from '~/container/desktop/quiz/typeEffectivenessQuiz/TypeEffectivenessQuiz.desktop'
import TypeEffectivenessQuizMobile from '~/views/mobile/quiz/typeEffectivenessQuiz/TypeEffectivenessQuiz.mobile'

export const revalidate = 31536000 // 24시간마다 재생성

export const metadata: Metadata = {
  title: '타입 상성 퀴즈 | 포케 코리아',
  description: '타입 상성을 계산해서 정답을 맞춰보세요!',
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
  },
  openGraph: {
    title: '타입 상성 퀴즈 | 포케 코리아',
    description: '타입 상성을 계산해서 정답을 맞춰보세요!',
    url: 'https://poke-korea.com/quiz/type-effectiveness',
    type: 'website',
    siteName: '포케 코리아',
    locale: 'ko_KR',
    images: [
      {
        url: 'https://poke-korea.com/assets/image/ogImage.png',
        width: 1200,
        height: 630,
        alt: '타입 상성 퀴즈 | 포케 코리아',
        type: 'image/png',
      },
    ],
  },
  alternates: {
    canonical: 'https://poke-korea.com/quiz/type-effectiveness',
  },
}

const TypeEffectivenessQuizPage = async () => {
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  return (
    <main className={`${isMobile ? '' : 'pt-30'}`}>
      <TypeEffectivenessQuizProvider>
        {isMobile ? (
          <Fragment>
            <HeaderMobile />
            <TypeEffectivenessQuizMobile />
            <FooterMobile />
          </Fragment>
        ) : (
          <Fragment>
            <HeaderDesktop />
            <TypeEffectivenessQuizDesktop />
            <FooterDesktop />
          </Fragment>
        )}
      </TypeEffectivenessQuizProvider>
    </main>
  )
}

export default TypeEffectivenessQuizPage
