'use client'

import { Fragment } from 'react'

import { usePokemonTypeQuizContext } from '~/context/PokemonTypeQuiz.context'

import PokemonTypeQuizBefore from './PokemonTypeQuizBefore.view'
import PokemonTypeQuizPlay from './PokemonTypeQuizPlay.view'
import PokemonTypeQuizResult from './PokemonTypeQuizResult.view'

const PokemonTypeQuiz = () => {
  const { quizViewStage } = usePokemonTypeQuizContext()

  return (
    <Fragment>
      {quizViewStage === 'BEFORE' && <PokemonTypeQuizBefore />}
      {quizViewStage === 'QUIZ' && <PokemonTypeQuizPlay />}
      {quizViewStage === 'RESULT' && <PokemonTypeQuizResult />}
    </Fragment>
  )
}

export default PokemonTypeQuiz
