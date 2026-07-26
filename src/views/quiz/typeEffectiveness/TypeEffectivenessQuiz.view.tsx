'use client'

import { Fragment } from 'react'
import { useTypeEffectivenessQuizContext } from '~/context/TypeEffectivenessQuiz.context'
import TypeEffectivenessQuizBefore from './TypeEffectivenessQuizBefore'
import TypeEffectivenessQuizPlay from './TypeEffectivenessQuizPlay'
import TypeEffectivenessQuizResult from './TypeEffectivenessQuizResult'

/**
 * 타입 상성 퀴즈 본문 (반응형 단일). quizViewStage로 3단계를 전환하는 스위치.
 */
const TypeEffectivenessQuizView = () => {
  const { quizViewStage } = useTypeEffectivenessQuizContext()

  return (
    <Fragment>
      {quizViewStage === 'BEFORE' && <TypeEffectivenessQuizBefore />}
      {quizViewStage === 'QUIZ' && <TypeEffectivenessQuizPlay />}
      {quizViewStage === 'RESULT' && <TypeEffectivenessQuizResult />}
    </Fragment>
  )
}

export default TypeEffectivenessQuizView
