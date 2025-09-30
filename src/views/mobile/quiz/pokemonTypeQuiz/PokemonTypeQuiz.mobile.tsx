'use client'

import { Fragment } from 'react'
import { usePokemonTypeQuizContext } from '~/context/PokemonTypeQuiz.context'
import PokemonTypeQuizBeforeStage from './pokemonTypeQuiz.before/PokemonTypeQuizBeforeStage'
import PokemonTypeQuiz from './pokemonTypeQuiz.quiz/PokemonTypeQuiz'
import PokemonTypeQuizResult from './pokemonTypeQuiz.result/PokemonTypeQuizResult'

const PokemonTypeQuizMobile = () => {
  const { quizViewStage } = usePokemonTypeQuizContext()

  return (
    <Fragment>
      {quizViewStage === 'BEFORE' && <PokemonTypeQuizBeforeStage />}
      {quizViewStage === 'QUIZ' && <PokemonTypeQuiz />}
      {quizViewStage === 'RESULT' && <PokemonTypeQuizResult />}
    </Fragment>
  )
}

export default PokemonTypeQuizMobile
