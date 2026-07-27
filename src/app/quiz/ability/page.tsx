import { headers } from 'next/headers'
import { Fragment } from 'react'
import MobileTabBar from '~/components/MobileTabBar'
import DesktopFooterContainer from '~/container/desktop/footer/Footer.container'
import DesktopHeaderContainer from '~/container/desktop/header/Header.container'
import MobileFooterContainer from '~/container/mobile/footer/Footer.container'
import MobileHeaderContainer from '~/container/mobile/header/Header.container'
import { AbilityQuizProvider } from '~/context/AbilityQuiz.context'
import { detectUserAgent } from '~/module/device.module'
import {
  ABILITY_QUIZ_JSON_LD,
  ABILITY_QUIZ_HOWTO_JSON_LD,
} from '~/constants/quizJsonLd'
import AbilityQuizView from '~/views/quiz/ability/AbilityQuiz.view'
import { QUIZ_ABILITY_META } from '../_metadata/quizMetadata'

export const revalidate = 31536000

export const metadata = QUIZ_ABILITY_META

const AbilityQuizPage = async () => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  return (
    <Fragment>
      {/* 본문 반응형 단일(AbilityQuizView). UA 분기는 전역 크롬 선택으로만 남는다. */}
      <AbilityQuizProvider>
        {isMobile ? (
          <main className="w-full min-h-screen">
            <MobileHeaderContainer />
            <AbilityQuizView />
            <MobileFooterContainer />
            <MobileTabBar />
          </main>
        ) : (
          <main className="w-full min-h-screen pt-30">
            <DesktopHeaderContainer />
            <AbilityQuizView />
            <DesktopFooterContainer />
          </main>
        )}
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
