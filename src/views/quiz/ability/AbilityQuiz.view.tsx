'use client'

import { Fragment } from 'react'

import { useAbilityQuizContext } from '~/context/AbilityQuiz.context'

import AbilityQuizBefore from './AbilityQuizBefore.view'
import AbilityQuizPlay from './AbilityQuizPlay.view'
import AbilityQuizResult from './AbilityQuizResult.view'

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
