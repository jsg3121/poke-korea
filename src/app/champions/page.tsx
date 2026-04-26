import { Metadata } from 'next'
import { headers } from 'next/headers'
import { GetChampionsMetaSummaryDocument } from '~/graphql/gqlGenerated'
import {
  GetChampionsMetaSummaryQuery,
  GetChampionsMetaSummaryQueryVariables,
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
    GetChampionsMetaSummaryQuery,
    GetChampionsMetaSummaryQueryVariables
  >({
    query: GetChampionsMetaSummaryDocument,
    fetchPolicy: 'network-only',
  })

  const metaSummary = data?.getChampionsMetaSummary || []
  const topPokemons = [...metaSummary]
    .sort((a, b) => (b.usageRate ?? 0) - (a.usageRate ?? 0))
    .slice(0, 10)

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
