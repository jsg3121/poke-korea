import { Metadata } from 'next'
import { headers } from 'next/headers'
import { GetChampionsPokemonListDocument } from '~/graphql/gqlGenerated'
import {
  ChampionsPokemonFilterInput,
  GetChampionsPokemonListQuery,
  GetChampionsPokemonListQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import { changeTypeArrayToString } from '~/module/filter.module'
import ChampionsPokedexDesktop from '~/views/desktop/champions/ChampionsPokedex.desktop'
import ChampionsPokedexMobile from '~/views/mobile/champions/ChampionsPokedex.mobile'
import { generateChampionsPokedexMetadata } from '../_metadata/championsMetadata'

export const revalidate = 86400

export const generateMetadata = (): Promise<Metadata> => {
  return generateChampionsPokedexMetadata()
}

type PageProps = {
  searchParams: Promise<{
    type?: string
    search?: string
  }>
}

const ChampionsPokedexPage = async ({ searchParams }: PageProps) => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const { type, search } = await searchParams

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
        item: 'https://poke-korea.com/champions',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: '도감',
        item: 'https://poke-korea.com/champions/list',
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
      url: `https://poke-korea.com/champions/list/${pokemon.externalDexId}`,
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
      <main className="w-full min-h-screen">
        {isMobile ? (
          <ChampionsPokedexMobile
            pokemonList={pokemonList}
            hasNextPage={hasNextPage}
            endCursor={endCursor}
            totalCount={totalCount}
            initialFilter={filterInput}
          />
        ) : (
          <ChampionsPokedexDesktop
            pokemonList={pokemonList}
            hasNextPage={hasNextPage}
            endCursor={endCursor}
            totalCount={totalCount}
            initialFilter={filterInput}
          />
        )}
      </main>
    </>
  )
}

export default ChampionsPokedexPage
