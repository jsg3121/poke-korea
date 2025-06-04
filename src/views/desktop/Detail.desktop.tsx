import styled from 'styled-components'
import DetailBaseInfoContainer from '~/container/desktop/detail/detail.baseInfo/DetailBaseInfo.container'
import DetailSummaryContainer from '~/container/desktop/detail/detail.summary/DetailSummary.container'
import FooterContainer from '~/container/desktop/footer/Footer.container'
import HeaderContainer from '~/container/desktop/header/Header.container'

const DetailDesktop = () => {
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
        <DetailBaseInfoContainer />
      </section>
      <FooterContainer />
    </Main>
  )
}

export default DetailDesktop

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
