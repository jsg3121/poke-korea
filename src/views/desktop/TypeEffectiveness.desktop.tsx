import { NextSeo } from 'next-seo'
import styled from 'styled-components'
import { TYPE_EFFECTIVNESS_SEO_META } from '~/constants/seoMetaData'
import FooterContainer from '~/container/desktop/footer/Footer.container'
import HeaderContainer from '~/container/desktop/header/Header.container'
import TypeEffectivenessContainer from '~/container/desktop/typeEffectiveness/TypeEffectiveness.container'

const TypeEffectivenessDesktop = () => {
  return (
    <Main>
      <NextSeo
        title={TYPE_EFFECTIVNESS_SEO_META.title}
        description={TYPE_EFFECTIVNESS_SEO_META.description}
        canonical={TYPE_EFFECTIVNESS_SEO_META.caninicalUrl}
        openGraph={{
          type: 'website',
          url: TYPE_EFFECTIVNESS_SEO_META.caninicalUrl,
          title: TYPE_EFFECTIVNESS_SEO_META.title,
          description: TYPE_EFFECTIVNESS_SEO_META.description,
          images: [
            {
              url: 'https://poke-korea.com/assets/image/ogImage.png',
              width: 1200,
              height: 630,
              alt: 'poke-korea',
              type: 'image/png',
            },
            {
              url: 'https://poke-korea.com/assets/image/kakaoOg.png',
              width: 800,
              height: 800,
              alt: 'poke-korea',
              type: 'image/png',
            },
          ],
          siteName: '포케 코리아',
        }}
      />
      <HeaderContainer />
      <section aria-labelledby="pokemon-type-effectiveness-calculator">
        <h1
          id="pokemon-type-effectiveness-calculator"
          className="visually-hidden"
        >
          타입 상성 계산기
        </h1>
        <TypeEffectivenessContainer />
      </section>
      <FooterContainer />
    </Main>
  )
}

export default TypeEffectivenessDesktop

const Main = styled.main`
  width: 100%;
  min-height: 100vh;

  & > section {
    width: 100%;
    max-width: 1280px;
    height: 100%;
    padding: 0 20px;
    margin: 0 auto;
    position: relative;

    & > h1 {
      width: 100%;
      height: 3rem;
      font-size: 2.5rem;
      text-align: center;
      line-height: 3rem;
      color: var(--color-primary-4);
    }
  }
`
