import { Metadata } from 'next'
import { headers } from 'next/headers'
import { Fragment } from 'react'
import { detectUserAgent } from '~/module/device.module'
import { SilhouetteQuizProvider } from '~/context/SilhouetteQuiz.context'
import SilhouetteQuizDesktop from '~/views/desktop/quiz/silhouetteQuiz/SilhouetteQuiz.desktop'
import SilhouetteQuizMobile from '~/views/mobile/quiz/SilhouetteQuiz.mobile'
import HeaderContainer from '~/container/desktop/header/Header.container'
import FooterContainer from '~/container/desktop/footer/Footer.container'

export const revalidate = 31536000

export const metadata: Metadata = {
  title: '실루엣 퀴즈 | 포케 코리아',
  description:
    '포켓몬의 실루엣을 보고 어떤 포켓몬인지 맞춰보세요! 20문제로 구성된 객관식 퀴즈입니다.',
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
  },
  openGraph: {
    title: '실루엣 퀴즈 | 포케 코리아',
    description: '포켓몬의 실루엣을 보고 어떤 포켓몬인지 맞춰보세요!',
    url: 'https://poke-korea.com/quiz/silhouette',
    type: 'website',
    siteName: '포케 코리아',
    locale: 'ko_KR',
    images: [
      {
        url: 'https://poke-korea.com/assets/image/ogImage.png',
        width: 1200,
        height: 630,
        alt: '실루엣 퀴즈 | 포케 코리아',
        type: 'image/png',
      },
    ],
  },
  alternates: {
    canonical: 'https://poke-korea.com/quiz/silhouette',
  },
}

const SilhouetteQuizPage = async () => {
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  return (
    <Fragment>
      <main className="pt-30">
        <SilhouetteQuizProvider>
          {isMobile ? (
            <SilhouetteQuizMobile />
          ) : (
            <Fragment>
              <HeaderContainer />
              <SilhouetteQuizDesktop />
              <FooterContainer />
            </Fragment>
          )}
        </SilhouetteQuizProvider>
      </main>
    </Fragment>
  )
}

export default SilhouetteQuizPage
