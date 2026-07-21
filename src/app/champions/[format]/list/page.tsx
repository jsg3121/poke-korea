import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { GetChampionsPokemonListDocument } from '~/graphql/gqlGenerated'
import {
  ChampionsPokemonFilterInput,
  ChampionsPokemonSort,
  GetChampionsPokemonListQuery,
  GetChampionsPokemonListQueryVariables,
} from '~/graphql/typeGenerated'
import MobileTabBar from '~/components/MobileTabBar'
import DesktopFooterContainer from '~/container/desktop/footer/Footer.container'
import DesktopHeaderContainer from '~/container/desktop/header/Header.container'
import MobileFooterContainer from '~/container/mobile/footer/Footer.container'
import MobileHeaderContainer from '~/container/mobile/header/Header.container'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import { changeTypeArrayToString } from '~/module/filter.module'
import {
  parseFormatSlug,
  resolveFormatEnum,
} from '~/utils/championsFormat.util'
import ChampionsPokedexView from '~/views/champions/ChampionsPokedex.view'
import { generateChampionsPokedexMetadata } from '../../_metadata/championsMetadata'

export const revalidate = 86400

type PageProps = {
  params: Promise<{ format: string }>
  searchParams: Promise<{
    type?: string
    search?: string
    sort?: string
  }>
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { format } = await params
  const formatSlug = parseFormatSlug(format)

  if (!formatSlug) {
    return {
      title: '포켓몬 챔피언스 도감 | 포케코리아',
      robots: { index: false, follow: false },
    }
  }

  return generateChampionsPokedexMetadata(formatSlug)
}

const parseSort = (value: string | undefined): ChampionsPokemonSort => {
  if (value === 'dex') return ChampionsPokemonSort.DEX
  return ChampionsPokemonSort.USAGE
}

const ChampionsFormatListPage = async ({ params, searchParams }: PageProps) => {
  const { format } = await params
  const formatSlug = parseFormatSlug(format)

  if (!formatSlug) {
    notFound()
  }

  const formatEnum = resolveFormatEnum(formatSlug)

  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const { type, search, sort } = await searchParams
  const sortEnum = parseSort(sort)

  const filterInput: ChampionsPokemonFilterInput = {
    ...(search && { search }),
    ...(type && { types: changeTypeArrayToString(type) }),
  }

  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query<
    GetChampionsPokemonListQuery,
    GetChampionsPokemonListQueryVariables
  >({
    query: GetChampionsPokemonListDocument,
    variables: {
      input: {
        format: formatEnum,
        sort: sortEnum,
        filter: filterInput,
        pagination: {
          first: 20,
        },
      },
    },
    fetchPolicy: 'network-only',
  })

  const pokemonList =
    data?.getChampionsPokemonList?.edges.map((edge) => edge.node) || []
  const hasNextPage = !!data?.getChampionsPokemonList?.pageInfo.hasNextPage
  const endCursor = data?.getChampionsPokemonList?.pageInfo.endCursor || null
  const totalCount = data?.getChampionsPokemonList?.totalCount || 0

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '홈',
        item: 'https://poke-korea.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '챔피언스',
        item: `https://poke-korea.com/champions/${formatSlug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: '도감',
        item: `https://poke-korea.com/champions/${formatSlug}/list`,
      },
    ],
  }

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '포켓몬 챔피언스 포켓몬 목록',
    description: `포켓몬 챔피언스에 등장하는 ${totalCount}종 포켓몬`,
    numberOfItems: totalCount,
    itemListElement: pokemonList.slice(0, 10).map((pokemon, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: pokemon.name,
      url: `https://poke-korea.com/champions/${formatSlug}/list/${pokemon.externalDexId}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      {/* 콘텐츠는 반응형 단일(ChampionsPokedexView, ADR-0007). UA 분기는 전역
          크롬(헤더/푸터/탭바) 선택으로만 남는다(ability·list 개편과 동일 패턴). */}
      {isMobile ? (
        <main className="w-full min-h-screen">
          <MobileHeaderContainer />
          <ChampionsPokedexView
            pokemonList={pokemonList}
            hasNextPage={hasNextPage}
            endCursor={endCursor}
            totalCount={totalCount}
            initialFilter={filterInput}
            formatSlug={formatSlug}
            sort={sortEnum}
          />
          <MobileFooterContainer />
          <MobileTabBar />
        </main>
      ) : (
        // h-40 스페이서 = 데스크톱 fixed 헤더(120px) + 챔피언스 SubNav(40px) 실높이.
        // champions는 헤더 안에 SubNav가 붙어 ability/list의 pt-30(120px)보다 40px 크다.
        // sticky 필터 desktop:top-40과 정합.
        <main className="w-full min-h-screen">
          <div className="h-40">
            <DesktopHeaderContainer />
          </div>
          <ChampionsPokedexView
            pokemonList={pokemonList}
            hasNextPage={hasNextPage}
            endCursor={endCursor}
            totalCount={totalCount}
            initialFilter={filterInput}
            formatSlug={formatSlug}
            sort={sortEnum}
          />
          <DesktopFooterContainer />
        </main>
      )}
    </>
  )
}

export default ChampionsFormatListPage
