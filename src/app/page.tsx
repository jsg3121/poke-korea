import { Metadata } from 'next'
import { headers } from 'next/headers'
import { GetPokemonListDocument } from '~/graphql/gqlGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import {
  changeTypeArrayToString,
  getGenerationParams,
  toBooleanOrUndefined,
} from '~/module/filter.module'
import MainDesktop from '~/views/desktop/main/Main.desktop'
import MainMobile from '~/views/mobile/main/Main.mobile'

export const revalidate = 3600 // 1시간마다 재생성

export const metadata: Metadata = {
  title: '포켓몬의 모든 정보 포케 코리아',
  description: `
    언제, 어디서든, 포켓몬의 정보를 빠르고 편리하게 확인하실 수 있습니다.
    카드형식을 통해 포켓몬의 능력치를 확인할 수 있고 타입 또는 진화 여부 등으로 원하는 포켓몬을 빠르게 찾아보세요.
    간단한 포켓몬 정보부터 특정 포켓몬의 자세한 정보까지 검색해 확인해보세요.
  `,
  openGraph: {
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
  },
  alternates: {
    canonical: 'https://poke-korea.com/',
  },
}

type searchParamsKey =
  | 'name'
  | 'type'
  | 'isMega'
  | 'isRegion'
  | 'isEvolution'
  | 'generation'

type PageProps = {
  searchParams: Promise<{
    [key in searchParamsKey]: string
  }>
}

const HomePage = async ({ searchParams }: PageProps) => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const apolloClient = initializeApollo()

  const { type, isMega, isRegion, isEvolution, generation, name } =
    await searchParams

  const filterInput = {
    ...(name && {
      name,
    }),
    ...(generation && {
      generation: getGenerationParams(generation),
    }),
    ...(type && { types: changeTypeArrayToString(type as string) }),
    isMegaEvolution: toBooleanOrUndefined(isMega as string),
    isRegionForm: toBooleanOrUndefined(isRegion as string),
    isEvolution: toBooleanOrUndefined(isEvolution as string),
  }

  // 필터가 없는 경우에만 캐싱된 데이터 사용
  const hasFilters =
    name || type || isMega || isRegion || isEvolution || generation

  const { data } = await apolloClient.query({
    query: GetPokemonListDocument,
    variables: {
      filter: filterInput,
    },
    fetchPolicy: hasFilters ? 'no-cache' : 'cache-first',
  })

  const pokemonList = data?.getPokemonList || []

  return (
    <main className="w-full min-h-screen">
      {isMobile ? (
        <MainMobile pokemonList={pokemonList} />
      ) : (
        <MainDesktop pokemonList={pokemonList} />
      )}
    </main>
  )
}

export default HomePage
