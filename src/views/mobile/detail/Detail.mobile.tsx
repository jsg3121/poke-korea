'use client'

import MobileDetailCardBottomBanner from '~/components/adSlot/MobileDetailCardBottomBanner'
import MobileDetailCardTopBanner from '~/components/adSlot/MobileDetailCardTopBanner'
import MobileTabBar from '~/components/MobileTabBar'
import DetailBaseInfoContainer from '~/container/mobile/detail/detail.baseInfo/DetailBaseInfo.container'
import DetailSummaryContainer from '~/container/mobile/detail/detail.summary/DetailSummary.container'
import FooterContainer from '~/container/mobile/footer/Footer.container'
import HeaderContainer from '~/container/mobile/header/Header.container'

const DetailMobile = () => {
  return (
    <main className="w-full min-h-screen">
      <HeaderContainer />
      <section className="w-full h-full p-0 mx-auto relative">
        <DetailSummaryContainer />
        <MobileDetailCardTopBanner />
        <DetailBaseInfoContainer />
      </section>
      <MobileDetailCardBottomBanner />
      <FooterContainer />
      <MobileTabBar />
    </main>
  )
}

export default DetailMobile
