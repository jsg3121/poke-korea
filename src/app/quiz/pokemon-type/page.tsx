import { Fragment } from 'react'
import { headers } from 'next/headers'

import {
  POKEMON_TYPE_QUIZ_HOWTO_JSON_LD,
  POKEMON_TYPE_QUIZ_JSON_LD,
} from '~/constants/quizJsonLd'
import { detectUserAgent } from '~/modules/device.module'
import { PokemonTypeQuizProvider } from '~/context/PokemonTypeQuiz.context'
import MobileTabBar from '~/components/MobileTabBar'
import DesktopFooterContainer from '~/containers/desktop/footer/Footer.container'
import DesktopHeaderContainer from '~/containers/desktop/header/Header.container'
import MobileFooterContainer from '~/containers/mobile/footer/Footer.container'
import MobileHeaderContainer from '~/containers/mobile/header/Header.container'
import PokemonTypeQuizView from '~/views/quiz/pokemonType/PokemonTypeQuiz.view'

import { QUIZ_POKEMON_TYPE_META } from '../_metadata/quizMetadata'

export const revalidate = 31536000

export const metadata = QUIZ_POKEMON_TYPE_META

const PokemonTypeQuizPage = async () => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  return (
    <Fragment>
      {/* 본문 반응형 단일(PokemonTypeQuizView). UA 분기는 전역 크롬 선택으로만. */}
      <PokemonTypeQuizProvider>
        {isMobile ? (
          <main className="w-full min-h-screen">
            <MobileHeaderContainer />
            <PokemonTypeQuizView />
            <MobileFooterContainer />
            <MobileTabBar />
          </main>
        ) : (
          <main className="w-full min-h-screen pt-30">
            <DesktopHeaderContainer />
            <PokemonTypeQuizView />
            <DesktopFooterContainer />
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
