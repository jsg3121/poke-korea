import { Fragment } from 'react'
import { headers } from 'next/headers'

import {
  SILHOUETTE_QUIZ_HOWTO_JSON_LD,
  SILHOUETTE_QUIZ_JSON_LD,
} from '~/constants/quizJsonLd'
import { detectUserAgent } from '~/modules/device.module'
import { SilhouetteQuizProvider } from '~/context/SilhouetteQuiz.context'
import MobileTabBar from '~/components/MobileTabBar.component'
import DesktopFooter from '~/containers/desktop/footer/Footer.container'
import DesktopHeader from '~/containers/desktop/header/Header.container'
import MobileFooter from '~/containers/mobile/footer/Footer.container'
import MobileHeader from '~/containers/mobile/header/Header.container'
import SilhouetteQuiz from '~/views/quiz/silhouette/SilhouetteQuiz.view'

import { QUIZ_SILHOUETTE_META } from '../_metadata/quizMetadata'

export const revalidate = 31536000

export const metadata = QUIZ_SILHOUETTE_META

const SilhouetteQuizPage = async () => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  return (
    <Fragment>
      {/* 본문은 반응형 단일(SilhouetteQuiz, ADR-0007). Provider는 device 분기
          위에서 감싸 상태를 공유한다. UA 분기는 전역 크롬 선택으로만 남는다. */}
      <SilhouetteQuizProvider>
        {isMobile ? (
          <main className="w-full min-h-screen">
            <MobileHeader />
            <SilhouetteQuiz />
            <MobileFooter />
            <MobileTabBar />
          </main>
        ) : (
          <main className="w-full min-h-screen">
            <DesktopHeader />
            <SilhouetteQuiz />
            <DesktopFooter />
          </main>
        )}
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
