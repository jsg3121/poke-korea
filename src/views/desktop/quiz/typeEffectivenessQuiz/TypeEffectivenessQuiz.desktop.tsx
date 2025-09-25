'use client'

import { Fragment } from 'react'
import { useTypeEffectivenessQuizContext } from '~/context/TypeEffectivenessQuiz.context'
import TypeEffectivenessQuizBeforeStage from './typeEffectivenessQuiz.before/TypeEffectivenessQuizBeforeStage'
import TypeEffectivenessQuiz from './typeEffectivenessQuiz.quiz/TypeEffectivenessQuiz'
import TypeEffectivenessQuizResult from './typeEffectivenessQuiz.result/TypeEffectivenessQuizResult'

const TypeEffectivenessQuizDesktop = () => {
  const { quizViewStage } = useTypeEffectivenessQuizContext()

  return (
    <Fragment>
      {quizViewStage === 'BEFORE' && <TypeEffectivenessQuizBeforeStage />}
      {quizViewStage === 'QUIZ' && <TypeEffectivenessQuiz />}
      {quizViewStage === 'RESULT' && <TypeEffectivenessQuizResult />}
    </Fragment>
  )
}

export default TypeEffectivenessQuizDesktop
