import { Metadata } from 'next'
import { headers } from 'next/headers'
import { GetChampionsMetaSummaryDocument } from '~/graphql/gqlGenerated'
import {
  GetChampionsMetaSummaryQuery,
  GetChampionsMetaSummaryQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import ChampionsTierDesktop from '~/views/desktop/champions/ChampionsTier.desktop'
import ChampionsTierMobile from '~/views/mobile/champions/ChampionsTier.mobile'
import { CHAMPIONS_TIER_META } from '../_metadata/championsMetadata'

export const revalidate = 86400

export const metadata: Metadata = CHAMPIONS_TIER_META

const ChampionsTierPage = async () => {
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

  const tierGroups = {
    S: metaSummary.filter((p) => p.tier === 'S'),
    A: metaSummary.filter((p) => p.tier === 'A'),
    B: metaSummary.filter((p) => p.tier === 'B'),
    C: metaSummary.filter((p) => p.tier === 'C'),
    D: metaSummary.filter((p) => p.tier === 'D'),
  }

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
        name: '티어 리스트',
        item: 'https://poke-korea.com/champions/tier',
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
          <ChampionsTierMobile tierGroups={tierGroups} />
        ) : (
          <ChampionsTierDesktop tierGroups={tierGroups} />
        )}
      </main>
    </>
  )
}

export default ChampionsTierPage
