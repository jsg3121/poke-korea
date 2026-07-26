import { headers } from 'next/headers'
import { Fragment } from 'react'
import MobileTabBar from '~/components/MobileTabBar'
import DesktopFooterContainer from '~/container/desktop/footer/Footer.container'
import DesktopHeaderContainer from '~/container/desktop/header/Header.container'
import MobileFooterContainer from '~/container/mobile/footer/Footer.container'
import MobileHeaderContainer from '~/container/mobile/header/Header.container'
import { SilhouetteQuizProvider } from '~/context/SilhouetteQuiz.context'
import { detectUserAgent } from '~/module/device.module'
import {
  SILHOUETTE_QUIZ_JSON_LD,
  SILHOUETTE_QUIZ_HOWTO_JSON_LD,
} from '~/constants/quizJsonLd'
import SilhouetteQuizView from '~/views/quiz/silhouette/SilhouetteQuiz.view'
import { QUIZ_SILHOUETTE_META } from '../_metadata/quizMetadata'

export const revalidate = 31536000

export const metadata = QUIZ_SILHOUETTE_META

const SilhouetteQuizPage = async () => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  return (
    <Fragment>
      {/* 본문은 반응형 단일(SilhouetteQuizView, ADR-0007). Provider는 device 분기
          위에서 감싸 상태를 공유한다. UA 분기는 전역 크롬 선택으로만 남는다. */}
      <SilhouetteQuizProvider>
        {isMobile ? (
          <main className="w-full min-h-screen">
            <MobileHeaderContainer />
            <SilhouetteQuizView />
            <MobileFooterContainer />
            <MobileTabBar />
          </main>
        ) : (
          <main className="w-full min-h-screen pt-30">
            <DesktopHeaderContainer />
            <SilhouetteQuizView />
            <DesktopFooterContainer />
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
