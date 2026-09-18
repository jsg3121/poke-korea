'use client'

import { Fragment } from 'react'

import { useAbilityQuizContext } from '~/context/AbilityQuiz.context'

import AbilityQuizBefore from './AbilityQuizBefore.view'
import AbilityQuizPlay from './AbilityQuizPlay.view'
import AbilityQuizResult from './AbilityQuizResult.view'

/**
 * 특성 퀴즈 본문 (반응형 단일). quizViewStage로 BEFORE/QUIZ/RESULT를 전환하는 스위치.
 */
const AbilityQuiz = () => {
  const { quizViewStage } = useAbilityQuizContext()

  return (
    <Fragment>
      {quizViewStage === 'BEFORE' && <AbilityQuizBefore />}
      {quizViewStage === 'QUIZ' && <AbilityQuizPlay />}
      {quizViewStage === 'RESULT' && <AbilityQuizResult />}
    </Fragment>
  )
}

export default AbilityQuiz
