import { Fragment } from 'react'

import {
  SILHOUETTE_QUIZ_HOWTO_JSON_LD,
  SILHOUETTE_QUIZ_JSON_LD,
} from '~/constants/quizJsonLd'
import { SilhouetteQuizProvider } from '~/context/SilhouetteQuiz.context'
import SilhouetteQuiz from '~/views/quiz/silhouette/SilhouetteQuiz.view'

import { QUIZ_SILHOUETTE_META } from '../_metadata/quizMetadata'

export const revalidate = 31536000

export const metadata = QUIZ_SILHOUETTE_META

const SilhouetteQuizPage = async () => {
  return (
    <Fragment>
      {/* 본문은 반응형 단일(SilhouetteQuiz, ADR-0007). Provider는 device 분기
          위에서 감싸 상태를 공유한다. UA 분기는 전역 크롬 선택으로만 남는다. */}
      <SilhouetteQuizProvider>
        <SilhouetteQuiz />
      </SilhouetteQuizProvider>
      <script
        id="silhouette-quiz-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(SILHOUETTE_QUIZ_JSON_LD),
        }}
      />
      <script
        id="silhouette-quiz-howto-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(SILHOUETTE_QUIZ_HOWTO_JSON_LD),
        }}
      />
    </Fragment>
  )
}

export default SilhouetteQuizPage
