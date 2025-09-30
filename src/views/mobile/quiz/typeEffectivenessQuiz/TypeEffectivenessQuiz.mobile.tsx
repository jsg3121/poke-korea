'use client'

import { Fragment } from 'react'
import { useTypeEffectivenessQuizContext } from '~/context/TypeEffectivenessQuiz.context'
import TypeEffectivenessQuizBeforeStage from './typeEffectivenessQuiz.before/TypeEffectivenessQuizBeforeStage'
import TypeEffectivenessQuiz from './typeEffectivenessQuiz.quiz/TypeEffectivenessQuiz'
import TypeEffectivenessQuizResult from './typeEffectivenessQuiz.result/TypeEffectivenessQuizResult'

const TypeEffectivenessQuizMobile = () => {
  const { quizViewStage } = useTypeEffectivenessQuizContext()

  return (
    <Fragment>
      {quizViewStage === 'BEFORE' && <TypeEffectivenessQuizBeforeStage />}
      {quizViewStage === 'QUIZ' && <TypeEffectivenessQuiz />}
      {quizViewStage === 'RESULT' && <TypeEffectivenessQuizResult />}
    </Fragment>
  )
}

export default TypeEffectivenessQuizMobile
