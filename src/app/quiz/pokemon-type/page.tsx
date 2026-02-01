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
import MobileTabBar from '~/components/MobileTabBar'
import {
  POKEMON_TYPE_QUIZ_JSON_LD,
  POKEMON_TYPE_QUIZ_HOWTO_JSON_LD,
} from '~/constants/quizJsonLd'
import { QUIZ_POKEMON_TYPE_META } from '~/constants/seoMetaData'

export const revalidate = 31536000 // 24시간마다 재생성

export const metadata = QUIZ_POKEMON_TYPE_META

const QuizMainPage = async () => {
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  return (
    <Fragment>
      <main className={`${isMobile ? '' : 'pt-40'}`}>
        <PokemonTypeQuizProvider>
          {isMobile ? (
            <Fragment>
              <HeaderMobile />
              <PokemonTypeQuizMobile />
              <FooterMobile />
              <MobileTabBar />
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
      <script
        id="pokemon-type-quiz-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(POKEMON_TYPE_QUIZ_JSON_LD),
        }}
      />
      <script
        id="pokemon-type-quiz-howto-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(POKEMON_TYPE_QUIZ_HOWTO_JSON_LD),
        }}
      />
    </Fragment>
  )
}

export default QuizMainPage
