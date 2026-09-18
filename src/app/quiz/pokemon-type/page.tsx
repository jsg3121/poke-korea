import { Fragment } from 'react'

import {
  POKEMON_TYPE_QUIZ_HOWTO_JSON_LD,
  POKEMON_TYPE_QUIZ_JSON_LD,
} from '~/constants/quizJsonLd'
import { PokemonTypeQuizProvider } from '~/context/PokemonTypeQuiz.context'
import PokemonTypeQuiz from '~/views/quiz/pokemonType/PokemonTypeQuiz.view'

import { QUIZ_POKEMON_TYPE_META } from '../_metadata/quizMetadata'

export const revalidate = 31536000

export const metadata = QUIZ_POKEMON_TYPE_META

const PokemonTypeQuizPage = async () => {
  return (
    <Fragment>
      {/* 본문 반응형 단일(PokemonTypeQuiz). UA 분기는 전역 크롬 선택으로만. */}
      <PokemonTypeQuizProvider>
        <PokemonTypeQuiz />
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
