'use client'

import { Fragment } from 'react'

import { useTypeEffectivenessQuizContext } from '~/context/TypeEffectivenessQuiz.context'

import TypeEffectivenessQuizBefore from './TypeEffectivenessQuizBefore.view'
import TypeEffectivenessQuizPlay from './TypeEffectivenessQuizPlay.view'
import TypeEffectivenessQuizResult from './TypeEffectivenessQuizResult.view'

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
