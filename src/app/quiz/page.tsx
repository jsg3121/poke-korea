import { headers } from 'next/headers'
import { Fragment } from 'react'
import {
  QUIZ_ITEMLIST_JSON_LD,
  QUIZ_WEBPAGE_JSON_LD,
} from '~/constants/quizJsonLd'
import { QUIZ_MAIN_META } from './_metadata/quizMetadata'
import { detectUserAgent } from '~/module/device.module'
import QuizMainDesktop from '~/views/desktop/quiz/QuizMain.desktop'
import QuizMainMobile from '~/views/mobile/quiz/QuizMain.mobile'

export const revalidate = 31536000 // 24시간마다 재생성

export const metadata = QUIZ_MAIN_META

const QuizMainPage = async () => {
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  return (
    <Fragment>
      {isMobile ? <QuizMainMobile /> : <QuizMainDesktop />}
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
