import { headers } from 'next/headers'
import { Fragment } from 'react'
import MobileTabBar from '~/components/MobileTabBar'
import DesktopFooterContainer from '~/container/desktop/footer/Footer.container'
import DesktopHeaderContainer from '~/container/desktop/header/Header.container'
import MobileFooterContainer from '~/container/mobile/footer/Footer.container'
import MobileHeaderContainer from '~/container/mobile/header/Header.container'
import { PokemonTypeQuizProvider } from '~/context/PokemonTypeQuiz.context'
import { detectUserAgent } from '~/module/device.module'
import {
  POKEMON_TYPE_QUIZ_JSON_LD,
  POKEMON_TYPE_QUIZ_HOWTO_JSON_LD,
} from '~/constants/quizJsonLd'
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
