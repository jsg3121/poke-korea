'use client'

import { Fragment } from 'react'
import { usePokemonTypeQuizContext } from '~/context/PokemonTypeQuiz.context'
import PokemonTypeQuizBefore from './PokemonTypeQuizBefore'
import PokemonTypeQuizPlay from './PokemonTypeQuizPlay'
import PokemonTypeQuizResult from './PokemonTypeQuizResult'

/**
 * 포켓몬 타입 퀴즈 본문 (반응형 단일). quizViewStage로 3단계를 전환하는 스위치.
 */
const PokemonTypeQuizView = () => {
  const { quizViewStage } = usePokemonTypeQuizContext()

  return (
    <Fragment>
      {quizViewStage === 'BEFORE' && <PokemonTypeQuizBefore />}
      {quizViewStage === 'QUIZ' && <PokemonTypeQuizPlay />}
      {quizViewStage === 'RESULT' && <PokemonTypeQuizResult />}
    </Fragment>
  )
}

export default PokemonTypeQuizView
