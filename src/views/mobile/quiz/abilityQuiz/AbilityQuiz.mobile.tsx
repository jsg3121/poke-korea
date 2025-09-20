'use client'

import { Fragment } from 'react'
import { useAbilityQuizContext } from '~/context/AbilityQuiz.context'
import AbilityQuizBeforeStage from './abilityQuiz.before/AbilityQuizBeforeStage'
import AbilityQuiz from './abilityQuiz.quiz/AbilityQuiz'
import AbilityQuizResult from './abilityQuiz.result/AbilityQuizResult'

const AbilityQuizMobile = () => {
  const { quizViewStage } = useAbilityQuizContext()

  return (
    <Fragment>
      {quizViewStage === 'BEFORE' && (
        <section className="h-full w-full px-[20px]">
          <AbilityQuizBeforeStage />
        </section>
      )}
      {quizViewStage === 'QUIZ' && <AbilityQuiz />}
      {quizViewStage === 'RESULT' && <AbilityQuizResult />}
    </Fragment>
  )
}

export default AbilityQuizMobile