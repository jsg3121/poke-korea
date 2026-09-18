import { Fragment } from 'react'
import { headers } from 'next/headers'

import {
  POKEMON_TYPE_QUIZ_HOWTO_JSON_LD,
  POKEMON_TYPE_QUIZ_JSON_LD,
} from '~/constants/quizJsonLd'
import { detectUserAgent } from '~/modules/device.module'
import { PokemonTypeQuizProvider } from '~/context/PokemonTypeQuiz.context'
import MobileTabBar from '~/components/MobileTabBar.component'
import DesktopFooter from '~/containers/desktop/footer/Footer.container'
import DesktopHeader from '~/containers/desktop/header/Header.container'
import MobileFooter from '~/containers/mobile/footer/Footer.container'
import MobileHeader from '~/containers/mobile/header/Header.container'
import PokemonTypeQuiz from '~/views/quiz/pokemonType/PokemonTypeQuiz.view'

import { QUIZ_POKEMON_TYPE_META } from '../_metadata/quizMetadata'

export const revalidate = 31536000

export const metadata = QUIZ_POKEMON_TYPE_META

const PokemonTypeQuizPage = async () => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  return (
    <Fragment>
      {/* 본문 반응형 단일(PokemonTypeQuiz). UA 분기는 전역 크롬 선택으로만. */}
      <PokemonTypeQuizProvider>
        {isMobile ? (
          <main className="w-full min-h-screen">
            <MobileHeader />
            <PokemonTypeQuiz />
            <MobileFooter />
            <MobileTabBar />
          </main>
        ) : (
          <main className="w-full min-h-screen">
            <DesktopHeader />
            <PokemonTypeQuiz />
            <DesktopFooter />
          </main>
        )}
      </PokemonTypeQuizProvider>
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

export default PokemonTypeQuizPage
