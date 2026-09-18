import { Fragment } from 'react'
import { headers } from 'next/headers'

import {
  QUIZ_ITEMLIST_JSON_LD,
  QUIZ_WEBPAGE_JSON_LD,
} from '~/constants/quizJsonLd'
import { detectUserAgent } from '~/modules/device.module'
import MobileTabBar from '~/components/MobileTabBar.component'
import DesktopFooter from '~/containers/desktop/footer/Footer.container'
import DesktopHeader from '~/containers/desktop/header/Header.container'
import MobileFooter from '~/containers/mobile/footer/Footer.container'
import MobileHeader from '~/containers/mobile/header/Header.container'
import QuizMain from '~/views/quiz/QuizMain.view'

import { QUIZ_MAIN_META } from './_metadata/quizMetadata'

export const revalidate = 31536000

export const metadata = QUIZ_MAIN_META

const QuizMainPage = async () => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  return (
    <Fragment>
      {/* 본문은 반응형 단일(QuizMain, ADR-0007). UA 분기는 전역 크롬
          (헤더/푸터/탭바) 선택으로만 남는다(champions·ability 개편과 동일 패턴). */}
      {isMobile ? (
        <main className="w-full min-h-screen">
          <MobileHeader />
          <QuizMain />
          <MobileFooter />
          <MobileTabBar />
        </main>
      ) : (
        // pt-30(120px) = 데스크톱 fixed 헤더 실높이.
        <main className="w-full min-h-screen pt-30">
          <DesktopHeader />
          <QuizMain />
          <DesktopFooter />
        </main>
      )}
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
