import { headers } from 'next/headers'
import { Fragment } from 'react'
import FooterDesktop from '~/container/desktop/footer/Footer.container'
import HeaderDesktop from '~/container/desktop/header/Header.container'
import FooterMobile from '~/container/mobile/footer/Footer.container'
import HeaderMobile from '~/container/mobile/header/Header.container'
import { TypeEffectivenessQuizProvider } from '~/context/TypeEffectivenessQuiz.context'
import { detectUserAgent } from '~/module/device.module'
import TypeEffectivenessQuizDesktop from '~/container/desktop/quiz/typeEffectivenessQuiz/TypeEffectivenessQuiz.desktop'
import TypeEffectivenessQuizMobile from '~/views/mobile/quiz/typeEffectivenessQuiz/TypeEffectivenessQuiz.mobile'
import MobileTabBar from '~/components/MobileTabBar'
import { TYPE_EFFECTIVENESS_QUIZ_JSON_LD } from '~/constants/quizJsonLd'
import { QUIZ_TYPE_EFFECTIVENESS_META } from '~/constants/seoMetaData'

export const revalidate = 31536000 // 24시간마다 재생성

export const metadata = QUIZ_TYPE_EFFECTIVENESS_META

const TypeEffectivenessQuizPage = async () => {
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  return (
    <Fragment>
      <main className={`${isMobile ? '' : 'pt-40'}`}>
        <TypeEffectivenessQuizProvider>
          {isMobile ? (
            <Fragment>
              <HeaderMobile />
              <TypeEffectivenessQuizMobile />
              <FooterMobile />
              <MobileTabBar />
            </Fragment>
          ) : (
            <Fragment>
              <HeaderDesktop />
              <TypeEffectivenessQuizDesktop />
              <FooterDesktop />
            </Fragment>
          )}
        </TypeEffectivenessQuizProvider>
      </main>
      <script
        id="type-effectiveness-quiz-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(TYPE_EFFECTIVENESS_QUIZ_JSON_LD),
        }}
      />
    </Fragment>
  )
}

export default TypeEffectivenessQuizPage
