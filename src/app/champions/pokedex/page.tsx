import { Metadata } from 'next'
import { headers } from 'next/headers'
import { GetChampionsPokemonListDocument } from '~/graphql/gqlGenerated'
import {
  GetChampionsPokemonListQuery,
  GetChampionsPokemonListQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import ChampionsPokedexDesktop from '~/views/desktop/champions/ChampionsPokedex.desktop'
import ChampionsPokedexMobile from '~/views/mobile/champions/ChampionsPokedex.mobile'
import { CHAMPIONS_POKEDEX_META } from '../_metadata/championsMetadata'

export const revalidate = 86400

export const metadata: Metadata = CHAMPIONS_POKEDEX_META

const ChampionsPokedexPage = async () => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query<
    GetChampionsPokemonListQuery,
    GetChampionsPokemonListQueryVariables
  >({
    query: GetChampionsPokemonListDocument,
    variables: {
      input: {
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
        item: 'https://poke-korea.com/champions/pokedex',
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main className="w-full min-h-screen">
        {isMobile ? (
          <ChampionsPokedexMobile
            pokemonList={pokemonList}
            hasNextPage={hasNextPage}
            endCursor={endCursor}
            totalCount={totalCount}
          />
        ) : (
          <ChampionsPokedexDesktop
            pokemonList={pokemonList}
            hasNextPage={hasNextPage}
            endCursor={endCursor}
            totalCount={totalCount}
          />
        )}
      </main>
    </>
  )
}

export default ChampionsPokedexPage
