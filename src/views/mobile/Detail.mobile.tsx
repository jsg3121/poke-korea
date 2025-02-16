import Link from 'next/link'
import styled from 'styled-components'
import LogoIcon from '~/assets/logo.svg'
import DetailBaseInfoContainer from '~/container/mobile/detail/detail.baseInfo/DetailBaseInfo.container'
import DetailSummaryContainer from '~/container/mobile/detail/detail.summary/DetailSummary.container'
import FooterContainer from '~/container/mobile/footer/Footer.container'

const DetailMobile = () => {
  return (
    <Main>
      <header>
        <Link href="/">
          <i className="icon-logo-link">
            <LogoIcon />
          </i>
        </Link>
      </header>
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

export default DetailMobile

const Main = styled.main`
  width: 100%;
  min-height: 100vh;

  & > header {
    height: 5rem;
    background-color: var(--color-primary-2);
    display: flex;
    align-items: center;
    padding: 0 20px;

    & > a {
      width: 10rem;
      height: 2rem;
      display: block;

      & > i {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
  }

  & > .pokemon-detail-content {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0 auto;
    position: relative;
  }
`
