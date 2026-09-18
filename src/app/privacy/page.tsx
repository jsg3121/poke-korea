import { Fragment } from 'react'
import { headers } from 'next/headers'

import { detectUserAgent } from '~/modules/device.module'
import MobileTabBar from '~/components/MobileTabBar.component'
import DesktopFooter from '~/containers/desktop/footer/Footer.container'
import DesktopHeader from '~/containers/desktop/header/Header.container'
import MobileFooter from '~/containers/mobile/footer/Footer.container'
import MobileHeader from '~/containers/mobile/header/Header.container'
import Privacy from '~/views/privacy/Privacy.view'

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
      {/* 본문은 반응형 단일(Privacy, ADR-0007). UA 분기는 전역 크롬
          (헤더/푸터/탭바) 선택으로만 남는다(quiz·champions와 동일 패턴). */}
      {isMobile ? (
        <main className="w-full min-h-screen">
          <MobileHeader />
          <Privacy />
          <MobileFooter />
          <MobileTabBar />
        </main>
      ) : (
        // pt-30(120px) = 데스크톱 fixed 헤더 실높이.
        <main className="w-full min-h-screen pt-30">
          <DesktopHeader />
          <Privacy />
          <DesktopFooter />
        </main>
      )}
    </Fragment>
  )
}

export default PrivacyPage
