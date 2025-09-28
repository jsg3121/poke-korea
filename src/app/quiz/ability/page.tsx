import { Metadata } from 'next'
import { headers } from 'next/headers'
import { Fragment } from 'react'
import FooterDesktop from '~/container/desktop/footer/Footer.container'
import HeaderDesktop from '~/container/desktop/header/Header.container'
import FooterMobile from '~/container/mobile/footer/Footer.container'
import HeaderMobile from '~/container/mobile/header/Header.container'
import { AbilityQuizProvider } from '~/context/AbilityQuiz.context'
import { detectUserAgent } from '~/module/device.module'
import AbilityQuizDesktop from '~/container/desktop/quiz/abilityQuiz/AbilityQuiz.desktop'
import AbilityQuizMobile from '~/views/mobile/quiz/abilityQuiz/AbilityQuiz.mobile'

export const revalidate = 31536000

export const metadata: Metadata = {
  title: '특성 퀴즈 | 포케 코리아',
  description:
    '포켓몬의 특성 설명을 보고 어떤 특성인지 맞춰보세요! 20문제로 구성된 객관식 퀴즈입니다.',
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
  },
  openGraph: {
    title: '특성 퀴즈 | 포케 코리아',
    description: '포켓몬의 특성 설명을 보고 어떤 특성인지 맞춰보세요!',
    url: 'https://poke-korea.com/quiz/ability',
    type: 'website',
    siteName: '포케 코리아',
    locale: 'ko_KR',
    images: [
      {
        url: 'https://poke-korea.com/assets/image/ogImage.png',
        width: 1200,
        height: 630,
        alt: '특성 퀴즈 | 포케 코리아',
        type: 'image/png',
      },
    ],
  },
  alternates: {
    canonical: 'https://poke-korea.com/quiz/ability',
  },
}

const AbilityQuizPage = async () => {
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  return (
    <main className={`${isMobile ? '' : 'pt-30'}`}>
      <AbilityQuizProvider>
        {isMobile ? (
          <Fragment>
            <HeaderMobile />
            <AbilityQuizMobile />
            <FooterMobile />
          </Fragment>
        ) : (
          <Fragment>
            <HeaderDesktop />
            <AbilityQuizDesktop />
            <FooterDesktop />
          </Fragment>
        )}
      </AbilityQuizProvider>
    </main>
  )
}

export default AbilityQuizPage
