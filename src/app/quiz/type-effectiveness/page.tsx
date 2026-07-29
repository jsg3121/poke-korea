import { headers } from 'next/headers'
import { Fragment } from 'react'
import MobileTabBar from '~/components/MobileTabBar'
import DesktopFooterContainer from '~/container/desktop/footer/Footer.container'
import DesktopHeaderContainer from '~/container/desktop/header/Header.container'
import MobileFooterContainer from '~/container/mobile/footer/Footer.container'
import MobileHeaderContainer from '~/container/mobile/header/Header.container'
import { TypeEffectivenessQuizProvider } from '~/context/TypeEffectivenessQuiz.context'
import { detectUserAgent } from '~/module/device.module'
import {
  TYPE_EFFECTIVENESS_QUIZ_JSON_LD,
  TYPE_EFFECTIVENESS_QUIZ_HOWTO_JSON_LD,
} from '~/constants/quizJsonLd'
import TypeEffectivenessQuizView from '~/views/quiz/typeEffectiveness/TypeEffectivenessQuiz.view'
import { QUIZ_TYPE_EFFECTIVENESS_META } from '../_metadata/quizMetadata'

export const revalidate = 31536000

export const metadata = QUIZ_TYPE_EFFECTIVENESS_META

const TypeEffectivenessQuizPage = async () => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  return (
    <Fragment>
      {/* 본문 반응형 단일(TypeEffectivenessQuizView). UA 분기는 전역 크롬 선택으로만. */}
      <TypeEffectivenessQuizProvider>
        {isMobile ? (
          <main className="w-full min-h-screen">
            <MobileHeaderContainer />
            <TypeEffectivenessQuizView />
            <MobileFooterContainer />
            <MobileTabBar />
          </main>
        ) : (
          <main className="w-full min-h-screen pt-30">
            <DesktopHeaderContainer />
            <TypeEffectivenessQuizView />
            <DesktopFooterContainer />
          </main>
        )}
      </TypeEffectivenessQuizProvider>
      <script
        id="type-effectiveness-quiz-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(TYPE_EFFECTIVENESS_QUIZ_JSON_LD),
        }}
      />
      <script
        id="type-effectiveness-quiz-howto-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(TYPE_EFFECTIVENESS_QUIZ_HOWTO_JSON_LD),
        }}
      />
    </Fragment>
  )
}

export default TypeEffectivenessQuizPage
