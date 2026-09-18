import { Fragment } from 'react'

import {
  ABILITY_QUIZ_HOWTO_JSON_LD,
  ABILITY_QUIZ_JSON_LD,
} from '~/constants/quizJsonLd'
import { AbilityQuizProvider } from '~/context/AbilityQuiz.context'
import AbilityQuiz from '~/views/quiz/ability/AbilityQuiz.view'

import { QUIZ_ABILITY_META } from '../_metadata/quizMetadata'

export const revalidate = 31536000

export const metadata = QUIZ_ABILITY_META

const AbilityQuizPage = async () => {
  return (
    <Fragment>
      {/* 본문 반응형 단일(AbilityQuiz). UA 분기는 전역 크롬 선택으로만 남는다. */}
      <AbilityQuizProvider>
        <AbilityQuiz />
      </AbilityQuizProvider>
      <script
        id="ability-quiz-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ABILITY_QUIZ_JSON_LD),
        }}
      />
      <script
        id="ability-quiz-howto-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ABILITY_QUIZ_HOWTO_JSON_LD),
        }}
      />
    </Fragment>
  )
}

export default AbilityQuizPage
