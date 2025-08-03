'use client'

import DetailBaseInfoContainer from '~/container/desktop/detail/detail.baseInfo/DetailBaseInfo.container'
import DetailSummaryContainer from '~/container/desktop/detail/detail.summary/DetailSummary.container'
import FooterContainer from '~/container/desktop/footer/Footer.container'
import HeaderContainer from '~/container/desktop/header/Header.container'

const DetailDesktop = () => {
  return (
    <main className="w-full min-h-screen pt-30">
      <HeaderContainer />
      <section
        className="w-full h-full mx-auto relative"
        aria-labelledby="pokemon-detail-info"
      >
        <h1 className="visually-hidden" id="pokemon-detail-info">
          포켓몬 능력치 및 상세 정보
        </h1>
        <DetailSummaryContainer />
        <DetailBaseInfoContainer />
      </section>
      <FooterContainer />
    </main>
  )
}

export default DetailDesktop
