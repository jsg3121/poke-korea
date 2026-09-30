import { Fragment } from 'react'

import {
  QUIZ_ITEMLIST_JSON_LD,
  QUIZ_WEBPAGE_JSON_LD,
} from '~/constants/quizJsonLd'
import QuizMain from '~/views/quiz/QuizMain.view'

import { QUIZ_MAIN_META } from './_metadata/quizMetadata'

export const revalidate = 31536000

export const metadata = QUIZ_MAIN_META

const QuizMainPage = async () => {
  return (
    <Fragment>
      <QuizMain />
      <script
        id="quiz-webpage-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(QUIZ_WEBPAGE_JSON_LD),
        }}
      />
      <script
        id="quiz-itemlist-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(QUIZ_ITEMLIST_JSON_LD),
        }}
      />
    </Fragment>
  )
}

export default QuizMainPage
