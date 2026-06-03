import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { GetBestChampionsPokemonDocument } from '~/graphql/gqlGenerated'
import {
  ChampionsFormat,
  GetBestChampionsPokemonQuery,
  GetBestChampionsPokemonQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import ChampionsHomeDesktop from '~/views/desktop/champions/ChampionsHome.desktop'
import ChampionsHomeMobile from '~/views/mobile/champions/ChampionsHome.mobile'
import { generateChampionsHomeMetadata } from '../_metadata/championsMetadata'
import {
  ChampionsFormatSlug,
  parseFormatSlug,
  resolveFormatEnum,
} from '~/utils/championsFormat.util'

export const revalidate = 86400

interface PageProps {
  params: Promise<{ format: string }>
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

  return generateChampionsHomeMetadata(formatSlug)
}

const ChampionsFormatHomePage = async ({ params }: PageProps) => {
  const { format } = await params
  const formatSlug = parseFormatSlug(format)

  if (!formatSlug) {
    notFound()
  }

  const formatEnum = resolveFormatEnum(formatSlug)

  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query<
    GetBestChampionsPokemonQuery,
    GetBestChampionsPokemonQueryVariables
  >({
    query: GetBestChampionsPokemonDocument,
    variables: { format: formatEnum },
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
        item: `https://poke-korea.com/champions/${formatSlug}`,
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
        <ChampionsHomeMobile
          topPokemons={topPokemons}
          formatSlug={formatSlug as ChampionsFormatSlug}
        />
      ) : (
        <ChampionsHomeDesktop
          topPokemons={topPokemons}
          formatSlug={formatSlug as ChampionsFormatSlug}
        />
      )}
    </>
  )
}

export default ChampionsFormatHomePage
