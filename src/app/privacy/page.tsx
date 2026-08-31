import { headers } from 'next/headers'
import { Fragment } from 'react'
import MobileTabBar from '~/components/MobileTabBar'
import DesktopFooterContainer from '~/container/desktop/footer/Footer.container'
import DesktopHeaderContainer from '~/container/desktop/header/Header.container'
import MobileFooterContainer from '~/container/mobile/footer/Footer.container'
import MobileHeaderContainer from '~/container/mobile/header/Header.container'
import { detectUserAgent } from '~/module/device.module'
import PrivacyView from '~/views/privacy/Privacy.view'
import { PRIVACY_META } from './_metadata/privacyMetadata'

// 법령·서비스 변경 시에만 갱신되는 정적 문서라 재검증 주기를 길게 둔다.
export const revalidate = 31536000

export const metadata = PRIVACY_META

const PrivacyPage = async () => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  return (
    <Fragment>
      {/* 본문은 반응형 단일(PrivacyView, ADR-0007). UA 분기는 전역 크롬
          (헤더/푸터/탭바) 선택으로만 남는다(quiz·champions와 동일 패턴). */}
      {isMobile ? (
        <main className="w-full min-h-screen">
          <MobileHeaderContainer />
          <PrivacyView />
          <MobileFooterContainer />
          <MobileTabBar />
        </main>
      ) : (
        // pt-30(120px) = 데스크톱 fixed 헤더 실높이.
        <main className="w-full min-h-screen pt-30">
          <DesktopHeaderContainer />
          <PrivacyView />
          <DesktopFooterContainer />
        </main>
      )}
    </Fragment>
  )
}

export default PrivacyPage
