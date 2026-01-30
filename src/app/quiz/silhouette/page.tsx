import { headers } from 'next/headers'
import { Fragment } from 'react'
import FooterDesktop from '~/container/desktop/footer/Footer.container'
import HeaderDesktop from '~/container/desktop/header/Header.container'
import FooterMobile from '~/container/mobile/footer/Footer.container'
import HeaderMobile from '~/container/mobile/header/Header.container'
import { SilhouetteQuizProvider } from '~/context/SilhouetteQuiz.context'
import { detectUserAgent } from '~/module/device.module'
import SilhouetteQuizDesktop from '~/container/desktop/quiz/silhouetteQuiz/SilhouetteQuiz.desktop'
import SilhouetteQuizMobile from '~/views/mobile/quiz/silhouetteQuiz/SilhouetteQuiz.mobile'
import MobileTabBar from '~/components/MobileTabBar'
import {
  SILHOUETTE_QUIZ_JSON_LD,
  SILHOUETTE_QUIZ_HOWTO_JSON_LD,
} from '~/constants/quizJsonLd'
import { QUIZ_SILHOUETTE_META } from '~/constants/seoMetaData'

export const revalidate = 31536000

export const metadata = QUIZ_SILHOUETTE_META

const SilhouetteQuizPage = async () => {
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  return (
    <Fragment>
      <main className={`${isMobile ? '' : 'pt-40'}`}>
        <SilhouetteQuizProvider>
          {isMobile ? (
            <Fragment>
              <HeaderMobile />
              <SilhouetteQuizMobile />
              <FooterMobile />
              <MobileTabBar />
            </Fragment>
          ) : (
            <Fragment>
              <HeaderDesktop />
              <SilhouetteQuizDesktop />
              <FooterDesktop />
            </Fragment>
          )}
        </SilhouetteQuizProvider>
      </main>
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
