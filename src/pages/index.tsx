import { GetServerSideProps, NextPage } from 'next'
import { NextSeo } from 'next-seo'
import styled from 'styled-components'
import { useDevice } from '~/context/src/Device.context'
import { Pokemon } from '~/graphql/typeGenerated'
import {
  changeTypeArrayToString,
  initializeApollo,
  toBooleanOrUndefined,
} from '~/module'
import { DesktopView, MobileView } from '~/views'

interface HomeProps {
  loading: boolean
  pokemonList: Array<Pokemon>
}

const Main = styled.main`
  width: 100%;
  min-height: 100vh;
`

const Home: NextPage<HomeProps> = ({ pokemonList }) => {
  const { isMobile } = useDevice()

  return (
    <>
      <NextSeo
        title="포켓몬의 모든 정보 포케 코리아"
        description={`
          언제, 어디서든, 포켓몬의 정보를 빠르고 편리하게 확인하실 수 있습니다.
          카드형식을 통해 포켓몬의 능력치를 확인할 수 있고 타입 또는 진화 여부 등으로 원하는 포켓몬을 빠르게 찾아보세요.
          간단한 포켓몬 정보부터 특정 포켓몬의 자세한 정보까지 검색해 확인해보세요.
        `}
        canonical="https://poke-korea.com/"
        openGraph={{
          type: 'website',
          url: 'https://poke-korea.com/',
          title: '포켓몬의 모든 정보 포케 코리아',
          description:
            '간단한 포켓몬 정보부터 특정 포켓몬의 자세한 정보까지 검색하고 확인해보세요.',
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
      <Main>
        {isMobile ? (
          <MobileView.MainViews pokemonList={pokemonList} />
        ) : (
          <DesktopView.MainViews pokemonList={pokemonList} />
        )}
      </Main>
    </>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (props) => {
  const { query } = props
  const apolloClient = initializeApollo()

  const { type, isMega, isRegion, isEvolution, ...restQuery } = query

  const filterInput = {
    ...restQuery,
    ...(isMega && { isMega: toBooleanOrUndefined(isMega as string) }),
    ...(isRegion && { isRegion: toBooleanOrUndefined(isRegion as string) }),
    ...(isEvolution && {
      isEvolution: toBooleanOrUndefined(isEvolution as string),
    }),
    ...(type && { type: changeTypeArrayToString(type as string) }),
  }

  const { data, loading } = await apolloClient.query({
    query: QUERY,
    variables: filterInput,
  })

  return {
    props: {
      loading,
      ...(data && {
        pokemonList: data.getPokemonFilter || [],
      }),
    },
  }
}
