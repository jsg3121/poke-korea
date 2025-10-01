import { Metadata } from 'next'
import { headers } from 'next/headers'
import { Fragment } from 'react'
import { QUIZ_WEBPAGE_JSON_LD } from '~/constants/quizJsonLd'
import { detectUserAgent } from '~/module/device.module'
import { getRobotsConfig } from '~/module/metadata.module'
import QuizMainDesktop from '~/views/desktop/quiz/QuizMain.desktop'
import QuizMainMobile from '~/views/mobile/quiz/QuizMain.mobile'

export const revalidate = 31536000 // 24시간마다 재생성

export const metadata: Metadata = {
  title: '포켓몬 퀴즈 | 포케 코리아',
  description:
    '포켓몬의 실루엣, 특성, 타입, 상성을 정보를 통해 재미있는 퀴즈를 맞추며 포켓몬의 정보를 확인하고 배워보세요!',
  robots: getRobotsConfig(),
  openGraph: {
    title: '포켓몬 퀴즈 | 포케 코리아',
    description:
      '포켓몬의 실루엣, 특성, 타입, 상성을 정보를 통해 재미있는 퀴즈를 맞추며 포켓몬의 정보를 확인하고 배워보세요!',
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
    <Fragment>
      {isMobile ? <QuizMainMobile /> : <QuizMainDesktop />}
      <script
        id="type-effectiveness-quiz-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(QUIZ_WEBPAGE_JSON_LD),
        }}
      />
    </Fragment>
  )
}

export default QuizMainPage
