'use client'

import { Fragment } from 'react'

import { useSilhouetteQuizContext } from '~/context/SilhouetteQuiz.context'

import SilhouetteQuizBefore from './SilhouetteQuizBefore.view'
import SilhouetteQuizPlay from './SilhouetteQuizPlay.view'
import SilhouetteQuizResult from './SilhouetteQuizResult.view'

const SilhouetteQuiz = () => {
  const { quizViewStage } = useSilhouetteQuizContext()

  return (
    <Fragment>
      {quizViewStage === 'BEFORE' && <SilhouetteQuizBefore />}
      {quizViewStage === 'QUIZ' && <SilhouetteQuizPlay />}
      {quizViewStage === 'RESULT' && <SilhouetteQuizResult />}
    </Fragment>
  )
}

export default SilhouetteQuiz
