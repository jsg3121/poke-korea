import { Metadata } from 'next'
import { headers } from 'next/headers'
import { Fragment } from 'react'
import { detectUserAgent } from '~/module/device.module'
import QuizMainDesktop from '~/views/desktop/quiz/QuizMain.desktop'
import QuizMainMobile from '~/views/mobile/quiz/QuizMain.mobile'

export const revalidate = 31536000 // 24시간마다 재생성

export const metadata: Metadata = {
  title: '포켓몬 퀴즈 | 포케 코리아',
  description:
    '실루엣, 특성, 타입 상성 등 다양한 포켓몬 퀴즈를 풀어보세요! 20문제씩 도전해보세요.',
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
  },
  openGraph: {
    title: '포켓몬 퀴즈 | 포케 코리아',
    description: '실루엣, 특성, 타입 상성 등 다양한 포켓몬 퀴즈를 풀어보세요!',
    url: 'https://poke-korea.com/quiz',
    type: 'website',
    siteName: '포케 코리아',
    locale: 'ko_KR',
    images: [
      {
        url: 'https://poke-korea.com/assets/image/ogImage.png',
        width: 1200,
        height: 630,
        alt: '포켓몬 퀴즈 | 포케 코리아',
        type: 'image/png',
      },
    ],
  },
  alternates: {
    canonical: 'https://poke-korea.com/quiz',
  },
}

const QuizMainPage = async () => {
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  return (
    <Fragment>{isMobile ? <QuizMainMobile /> : <QuizMainDesktop />}</Fragment>
  )
}

export default QuizMainPage
