import { Metadata } from 'next'
import { headers } from 'next/headers'
import { Fragment } from 'react'
import FooterDesktop from '~/container/desktop/footer/Footer.container'
import HeaderDesktop from '~/container/desktop/header/Header.container'
import FooterMobile from '~/container/mobile/footer/Footer.container'
import HeaderMobile from '~/container/mobile/header/Header.container'
import { PokemonTypeQuizProvider } from '~/context/PokemonTypeQuiz.context'
import { detectUserAgent } from '~/module/device.module'
import PokemonTypeQuizDesktop from '~/container/desktop/quiz/pokemonTypeQuiz/PokemonTypeQuiz.desktop'
import PokemonTypeQuizMobile from '~/views/mobile/quiz/pokemonTypeQuiz/PokemonTypeQuiz.mobile'

export const revalidate = 31536000 // 24시간마다 재생성

export const metadata: Metadata = {
  title: '포켓몬 타입 퀴즈 | 포케 코리아',
  description: '특정 타입을 보고 해당 타입을 가지고 있는 포켓몬을 맞춰보세요!',
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
  },
  openGraph: {
    title: '실루엣 퀴즈 | 포케 코리아',
    description:
      '특정 타입을 보고 해당 타입을 가지고 있는 포켓몬을 맞춰보세요!',
    url: 'https://poke-korea.com/quiz/pokemon-type',
    type: 'website',
    siteName: '포케 코리아',
    locale: 'ko_KR',
    images: [
      {
        url: 'https://poke-korea.com/assets/image/ogImage.png',
        width: 1200,
        height: 630,
        alt: '포켓몬 타입 퀴즈 | 포케 코리아',
        type: 'image/png',
      },
    ],
  },
  alternates: {
    canonical: 'https://poke-korea.com/quiz/pokemon-type',
  },
}

const QuizMainPage = async () => {
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  return (
    <main className={`${isMobile ? '' : 'pt-40'}`}>
      <PokemonTypeQuizProvider>
        {isMobile ? (
          <Fragment>
            <HeaderMobile />
            <PokemonTypeQuizMobile />
            <FooterMobile />
          </Fragment>
        ) : (
          <Fragment>
            <HeaderDesktop />
            <PokemonTypeQuizDesktop />
            <FooterDesktop />
          </Fragment>
        )}
      </PokemonTypeQuizProvider>
    </main>
  )
}

export default QuizMainPage
