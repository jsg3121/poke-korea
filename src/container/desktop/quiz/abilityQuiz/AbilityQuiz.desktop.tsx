'use client'

import { Fragment } from 'react'
import { useAbilityQuizContext } from '~/context/AbilityQuiz.context'
import AbilityQuizBeforeStage from './abilityQuiz.before/AbilityQuizBeforeStage'
import AbilityQuiz from './abilityQuiz.quiz/AbilityQuiz'
import AbilityQuizResult from './abilityQuiz.result/AbilityQuizResult'

const AbilityQuizDesktop = () => {
  const { quizViewStage } = useAbilityQuizContext()

  return (
    <Fragment>
      {quizViewStage === 'BEFORE' && <AbilityQuizBeforeStage />}
      {quizViewStage === 'QUIZ' && <AbilityQuiz />}
      {quizViewStage === 'RESULT' && <AbilityQuizResult />}
    </Fragment>
  )
}

export default AbilityQuizDesktop
