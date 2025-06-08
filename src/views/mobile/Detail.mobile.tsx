import MobileDetailCardBottomBanner from '~/components/adSlot/MobileDetailCardBottomBanner'
import MobileDetailCardTopBanner from '~/components/adSlot/MobileDetailCardTopBanner'
import DetailBaseInfoContainer from '~/container/mobile/detail/detail.baseInfo/DetailBaseInfo.container'
import DetailSummaryContainer from '~/container/mobile/detail/detail.summary/DetailSummary.container'
import FooterContainer from '~/container/mobile/footer/Footer.container'
import HeaderContainer from '~/container/mobile/header/Header.container'

const DetailMobile = () => {
  return (
    <main className="w-full min-h-screen">
      <HeaderContainer />
      <section
        className="w-full h-full p-0 mx-auto relative"
        aria-labelledby="pokemon-detail-info"
      >
        <h1 className="visually-hidden" id="pokemon-detail-info">
          포켓몬 능력치 및 상세 정보
        </h1>
        <DetailSummaryContainer />
        <MobileDetailCardTopBanner />
        <DetailBaseInfoContainer />
      </section>
      <MobileDetailCardBottomBanner />
      <FooterContainer />
    </main>
  )
}

export default DetailMobile
