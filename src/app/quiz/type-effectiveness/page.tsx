import { Fragment } from 'react'

import {
  TYPE_EFFECTIVENESS_QUIZ_HOWTO_JSON_LD,
  TYPE_EFFECTIVENESS_QUIZ_JSON_LD,
} from '~/constants/quizJsonLd'
import { TypeEffectivenessQuizProvider } from '~/context/TypeEffectivenessQuiz.context'
import TypeEffectivenessQuiz from '~/views/quiz/typeEffectiveness/TypeEffectivenessQuiz.view'

import { QUIZ_TYPE_EFFECTIVENESS_META } from '../_metadata/quizMetadata'

export const revalidate = 31536000

export const metadata = QUIZ_TYPE_EFFECTIVENESS_META

const TypeEffectivenessQuizPage = async () => {
  return (
    <Fragment>
      {/* 본문 반응형 단일(TypeEffectivenessQuiz). UA 분기는 전역 크롬 선택으로만. */}
      <TypeEffectivenessQuizProvider>
        <TypeEffectivenessQuiz />
      </TypeEffectivenessQuizProvider>
      <script
        id="type-effectiveness-quiz-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(TYPE_EFFECTIVENESS_QUIZ_JSON_LD),
        }}
      />
      <script
        id="type-effectiveness-quiz-howto-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(TYPE_EFFECTIVENESS_QUIZ_HOWTO_JSON_LD),
        }}
      />
    </Fragment>
  )
}

export default TypeEffectivenessQuizPage
