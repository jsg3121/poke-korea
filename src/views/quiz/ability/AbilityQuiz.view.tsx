'use client'

import { Fragment } from 'react'
import { useAbilityQuizContext } from '~/context/AbilityQuiz.context'
import AbilityQuizBefore from './AbilityQuizBefore'
import AbilityQuizPlay from './AbilityQuizPlay'
import AbilityQuizResult from './AbilityQuizResult'

/**
 * 특성 퀴즈 본문 (반응형 단일). quizViewStage로 BEFORE/QUIZ/RESULT를 전환하는 스위치.
 */
const AbilityQuizView = () => {
  const { quizViewStage } = useAbilityQuizContext()

  return (
    <Fragment>
      {quizViewStage === 'BEFORE' && <AbilityQuizBefore />}
      {quizViewStage === 'QUIZ' && <AbilityQuizPlay />}
      {quizViewStage === 'RESULT' && <AbilityQuizResult />}
    </Fragment>
  )
}

export default AbilityQuizView
