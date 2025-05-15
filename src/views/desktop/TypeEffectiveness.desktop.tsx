import { NextSeo } from 'next-seo'
import Link from 'next/link'
import styled from 'styled-components'
import LogoIcon from '~/assets/logo.svg'
import FooterContainer from '~/container/desktop/footer/Footer.container'
import TypeEffectivenessContainer from '~/container/desktop/typeEffectiveness/TypeEffectiveness.container'

const SEO_META = {
  title: '포켓몬의 모든 정보 포케 코리아',
  description: `
    포켓몬 타입 상성표와 계산기로 상대의 약점을 빠르게 찾으세요!
    포켓몬 타입 상성표와 계산기를 통해 불꽃, 물, 풀 등 각 타입의 약점과 강점을 한눈에 확인하고,
    2배, 0.5배 데미지 계산부터 타입별 상태이상 면역 정보까지 한 번에 확인할 수 있어요.
  `,
  caninicalUrl: 'https://poke-korea.com/type-effectiveness',
}

const TypeEffectivenessDesktop = () => {
  return (
    <Main>
      <NextSeo
        title={SEO_META.title}
        description={SEO_META.description}
        canonical={SEO_META.caninicalUrl}
        openGraph={{
          type: 'website',
          url: SEO_META.caninicalUrl,
          title: SEO_META.title,
          description: SEO_META.description,
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
      <header>
        <Link href="/">
          <i className="icon-logo-link">
            <LogoIcon />
          </i>
        </Link>
      </header>
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

  & > header {
    height: 5rem;
    background-color: var(--color-primary-2);
    display: flex;
    align-items: center;
    padding: 0 2rem;

    & > a {
      width: 15rem;
      height: 3rem;
      display: block;
    }
  }

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
