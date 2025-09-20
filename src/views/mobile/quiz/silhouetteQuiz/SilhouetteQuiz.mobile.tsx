'use client'

import { Fragment } from 'react'
import { useSilhouetteQuizContext } from '~/context/SilhouetteQuiz.context'
import SilhouetteQuizBeforeStage from './silhouetteQuiz.before/SilhouetteQuizBeforeStage'
import SilhouetteQuiz from './silhouetteQuiz.quiz/SilhouetteQuiz'
import SilhouetteQuizResult from './silhouetteQuiz.result/SilhouetteQuizResult'

const SilhouetteQuizMobile = () => {
  const { quizViewStage } = useSilhouetteQuizContext()

  return (
    <Fragment>
      {quizViewStage === 'BEFORE' && (
        <section className="h-full w-full px-[20px]">
          <SilhouetteQuizBeforeStage />
        </section>
      )}
      {quizViewStage === 'QUIZ' && <SilhouetteQuiz />}
      {quizViewStage === 'RESULT' && <SilhouetteQuizResult />}
    </Fragment>
  )
}

export default SilhouetteQuizMobile
