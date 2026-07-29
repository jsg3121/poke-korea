'use client'

import { Fragment } from 'react'
import { useSilhouetteQuizContext } from '~/context/SilhouetteQuiz.context'
import SilhouetteQuizBefore from './SilhouetteQuizBefore'
import SilhouetteQuizPlay from './SilhouetteQuizPlay'
import SilhouetteQuizResult from './SilhouetteQuizResult'

/**
 * 실루엣 퀴즈 본문 (반응형 단일). quizViewStage로 BEFORE/QUIZ/RESULT를 전환하는
 * 얇은 스위치. 기존 desktop/mobile 2벌 래퍼를 하나로 통합했다(크롬은 page.tsx가 담당).
 */
const SilhouetteQuizView = () => {
  const { quizViewStage } = useSilhouetteQuizContext()

  return (
    <Fragment>
      {quizViewStage === 'BEFORE' && <SilhouetteQuizBefore />}
      {quizViewStage === 'QUIZ' && <SilhouetteQuizPlay />}
      {quizViewStage === 'RESULT' && <SilhouetteQuizResult />}
    </Fragment>
  )
}

export default SilhouetteQuizView
