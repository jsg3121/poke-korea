import { Metadata } from 'next'
import { headers } from 'next/headers'
import { GetPokemonListPaginatedDocument } from '~/graphql/gqlGenerated'
import {
  GetPokemonListPaginatedQuery,
  GetPokemonListPaginatedQueryVariables,
  PokemonEdge,
  PokemonFilterInput,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import {
  changeTypeArrayToString,
  getGenerationParams,
  toBooleanOrUndefined,
} from '~/module/filter.module'
import MainDesktop from '~/views/desktop/main/Main.desktop'
import MainMobile from '~/views/mobile/main/Main.mobile'

export const revalidate = 31536000 // 1년

export const metadata: Metadata = {
  title: '포켓몬 도감 | 포케 코리아',
  description: `
    모든 세대의 포켓몬을 한눈에! 타입, 진화 여부, 세대별로 필터링하여 원하는 포켓몬을 빠르게 찾아보세요.
    카드 형식을 통해 포켓몬의 능력치를 확인할 수 있고 타입 또는 진화 여부 등으로 원하는 포켓몬을 빠르게 찾아보세요.
  `,
  openGraph: {
    type: 'website',
    url: 'https://poke-korea.com/list',
    title: '포켓몬 도감 | 포케 코리아',
    locale: 'ko_KR',
    description:
      '모든 세대의 포켓몬을 한눈에! 타입, 진화 여부, 세대별로 필터링하여 원하는 포켓몬을 빠르게 찾아보세요.',
    images: [
      {
        url: 'https://poke-korea.com/assets/image/ogImage.png',
        width: 1200,
        height: 630,
        alt: '포켓몬 도감 | 포케 코리아',
        type: 'image/png',
      },
    ],
    siteName: '포케 코리아',
  },
  alternates: {
    canonical: 'https://poke-korea.com/list',
  },
  twitter: {
    card: 'summary_large_image',
    title: '포켓몬 도감 | 포케 코리아',
    description:
      '모든 세대의 포켓몬을 한눈에! 타입, 진화 여부, 세대별로 필터링하여 원하는 포켓몬을 빠르게 찾아보세요.',
    images: ['https://poke-korea.com/assets/image/ogImage.png'],
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

const ListPage = async ({ searchParams }: PageProps) => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const apolloClient = initializeApollo()

  const { type, isMega, isRegion, isEvolution, generation, name } =
    await searchParams

  const filterInput: PokemonFilterInput = {
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

  const { data } = await apolloClient.query<
    GetPokemonListPaginatedQuery,
    GetPokemonListPaginatedQueryVariables
  >({
    query: GetPokemonListPaginatedDocument,
    variables: {
      input: {
        filter: filterInput,
        pagination: {
          first: 20,
        },
      },
    },
    fetchPolicy: 'network-only',
  })

  const pokemonList =
    data?.getPokemonList?.edges.map((edge: PokemonEdge) => {
      return edge.node
    }) || []
  const hasNextPage = !!data?.getPokemonList.pageInfo.hasNextPage

  return (
    <main className="w-full min-h-screen">
      {isMobile ? (
        <MainMobile
          pokemonList={pokemonList}
          initialFilter={filterInput}
          hasNextPage={hasNextPage}
        />
      ) : (
        <MainDesktop
          pokemonList={pokemonList}
          initialFilter={filterInput}
          hasNextPage={hasNextPage}
        />
      )}
    </main>
  )
}

export default ListPage
