import styled from 'styled-components'
import MobileDetailCardBottomBanner from '~/components/adSlot/MobileDetailCardBottomBanner'
import MobileDetailCardTopBanner from '~/components/adSlot/MobileDetailCardTopBanner'
import DetailBaseInfoContainer from '~/container/mobile/detail/detail.baseInfo/DetailBaseInfo.container'
import DetailSummaryContainer from '~/container/mobile/detail/detail.summary/DetailSummary.container'
import FooterContainer from '~/container/mobile/footer/Footer.container'
import HeaderContainer from '~/container/mobile/header/Header.container'

const DetailMobile = () => {
  return (
    <Main>
      <HeaderContainer />
      <section
        className="pokemon-detail-content"
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
    </Main>
  )
}

export default DetailMobile

const Main = styled.main`
  width: 100%;
  min-height: 100vh;

  & > .pokemon-detail-content {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0 auto;
    position: relative;
  }
`
