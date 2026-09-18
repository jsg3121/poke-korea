'use client'

import { Fragment } from 'react'

import { usePokemonTypeQuizContext } from '~/context/PokemonTypeQuiz.context'

import PokemonTypeQuizBefore from './PokemonTypeQuizBefore.view'
import PokemonTypeQuizPlay from './PokemonTypeQuizPlay.view'
import PokemonTypeQuizResult from './PokemonTypeQuizResult.view'

/**
 * 포켓몬 타입 퀴즈 본문 (반응형 단일). quizViewStage로 3단계를 전환하는 스위치.
 */
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
