import { headers } from 'next/headers'
import { Fragment } from 'react'
import MobileTabBar from '~/components/MobileTabBar'
import DesktopFooterContainer from '~/container/desktop/footer/Footer.container'
import DesktopHeaderContainer from '~/container/desktop/header/Header.container'
import MobileFooterContainer from '~/container/mobile/footer/Footer.container'
import MobileHeaderContainer from '~/container/mobile/header/Header.container'
import { detectUserAgent } from '~/module/device.module'
import {
  QUIZ_ITEMLIST_JSON_LD,
  QUIZ_WEBPAGE_JSON_LD,
} from '~/constants/quizJsonLd'
import QuizMainView from '~/views/quiz/QuizMain.view'
import { QUIZ_MAIN_META } from './_metadata/quizMetadata'

export const revalidate = 31536000

export const metadata = QUIZ_MAIN_META

const QuizMainPage = async () => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  return (
    <Fragment>
      {/* 본문은 반응형 단일(QuizMainView, ADR-0007). UA 분기는 전역 크롬
          (헤더/푸터/탭바) 선택으로만 남는다(champions·ability 개편과 동일 패턴). */}
      {isMobile ? (
        <main className="w-full min-h-screen">
          <MobileHeaderContainer />
          <QuizMainView />
          <MobileFooterContainer />
          <MobileTabBar />
        </main>
      ) : (
        // pt-30(120px) = 데스크톱 fixed 헤더 실높이.
        <main className="w-full min-h-screen pt-30">
          <DesktopHeaderContainer />
          <QuizMainView />
          <DesktopFooterContainer />
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
