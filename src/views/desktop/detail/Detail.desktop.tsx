'use client'

import DetailBaseInfoContainer from '~/container/desktop/detail/detail.baseInfo/DetailBaseInfo.container'
import DetailSummaryContainer from '~/container/desktop/detail/detail.summary/DetailSummary.container'
import FooterContainer from '~/container/desktop/footer/Footer.container'
import HeaderContainer from '~/container/desktop/header/Header.container'

const DetailDesktop = () => {
  return (
    <main className="w-full min-h-screen pt-40">
      <HeaderContainer />
      <section className="w-full h-full mx-auto relative">
        <DetailSummaryContainer />
        <DetailBaseInfoContainer />
      </section>
      <FooterContainer />
    </main>
  )
}

export default DetailDesktop
