import { Metadata } from 'next'
import { headers } from 'next/headers'
import { GetBestChampionsPokemonDocument } from '~/graphql/gqlGenerated'
import {
  GetBestChampionsPokemonQuery,
  GetBestChampionsPokemonQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import ChampionsHomeDesktop from '~/views/desktop/champions/ChampionsHome.desktop'
import ChampionsHomeMobile from '~/views/mobile/champions/ChampionsHome.mobile'
import { generateChampionsHomeMetadata } from './_metadata/championsMetadata'

export const revalidate = 86400

export const generateMetadata = (): Promise<Metadata> => {
  return generateChampionsHomeMetadata()
}

const ChampionsPage = async () => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query<
    GetBestChampionsPokemonQuery,
    GetBestChampionsPokemonQueryVariables
  >({
    query: GetBestChampionsPokemonDocument,
    fetchPolicy: 'network-only',
  })

  const topPokemons = data?.getBestChampionsPokemon ?? []

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
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {isMobile ? (
        <ChampionsHomeMobile topPokemons={topPokemons} />
      ) : (
        <ChampionsHomeDesktop topPokemons={topPokemons} />
      )}
    </>
  )
}

export default ChampionsPage
