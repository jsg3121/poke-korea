'use client'

import { Fragment } from 'react'

import { useTypeEffectivenessQuizContext } from '~/context/TypeEffectivenessQuiz.context'

import TypeEffectivenessQuizBefore from './TypeEffectivenessQuizBefore.view'
import TypeEffectivenessQuizPlay from './TypeEffectivenessQuizPlay.view'
import TypeEffectivenessQuizResult from './TypeEffectivenessQuizResult.view'

/**
 * 타입 상성 퀴즈 본문 (반응형 단일). quizViewStage로 3단계를 전환하는 스위치.
 */
const TypeEffectivenessQuiz = () => {
  const { quizViewStage } = useTypeEffectivenessQuizContext()

  return (
    <Fragment>
      {quizViewStage === 'BEFORE' && <TypeEffectivenessQuizBefore />}
      {quizViewStage === 'QUIZ' && <TypeEffectivenessQuizPlay />}
      {quizViewStage === 'RESULT' && <TypeEffectivenessQuizResult />}
    </Fragment>
  )
}

export default TypeEffectivenessQuiz
