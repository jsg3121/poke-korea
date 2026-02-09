import { headers } from 'next/headers'
import { Fragment } from 'react'
import FooterDesktop from '~/container/desktop/footer/Footer.container'
import HeaderDesktop from '~/container/desktop/header/Header.container'
import FooterMobile from '~/container/mobile/footer/Footer.container'
import HeaderMobile from '~/container/mobile/header/Header.container'
import { AbilityQuizProvider } from '~/context/AbilityQuiz.context'
import { detectUserAgent } from '~/module/device.module'
import AbilityQuizDesktop from '~/container/desktop/quiz/abilityQuiz/AbilityQuiz.desktop'
import AbilityQuizMobile from '~/views/mobile/quiz/abilityQuiz/AbilityQuiz.mobile'
import MobileTabBar from '~/components/MobileTabBar'
import {
  ABILITY_QUIZ_JSON_LD,
  ABILITY_QUIZ_HOWTO_JSON_LD,
} from '~/constants/quizJsonLd'
import { QUIZ_ABILITY_META } from '../_metadata/quizMetadata'

export const revalidate = 31536000

export const metadata = QUIZ_ABILITY_META

const AbilityQuizPage = async () => {
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  return (
    <Fragment>
      <main className={`${isMobile ? '' : 'pt-40'}`}>
        <AbilityQuizProvider>
          {isMobile ? (
            <Fragment>
              <HeaderMobile />
              <AbilityQuizMobile />
              <FooterMobile />
              <MobileTabBar />
            </Fragment>
          ) : (
            <Fragment>
              <HeaderDesktop />
              <AbilityQuizDesktop />
              <FooterDesktop />
            </Fragment>
          )}
        </AbilityQuizProvider>
      </main>
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
