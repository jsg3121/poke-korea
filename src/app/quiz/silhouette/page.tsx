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
