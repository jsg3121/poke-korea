import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import {
  GetBestChampionsPokemonDocument,
  GetChampionsTeamCoresDocument,
} from '~/graphql/gqlGenerated'
import {
  GetBestChampionsPokemonQuery,
  GetBestChampionsPokemonQueryVariables,
  GetChampionsTeamCoresQuery,
  GetChampionsTeamCoresQueryVariables,
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

  const [{ data: bestData }, { data: teamCoresData }] = await Promise.all([
    apolloClient.query<
      GetBestChampionsPokemonQuery,
      GetBestChampionsPokemonQueryVariables
    >({
      query: GetBestChampionsPokemonDocument,
      variables: { format: formatEnum },
      fetchPolicy: 'network-only',
    }),
    apolloClient.query<
      GetChampionsTeamCoresQuery,
      GetChampionsTeamCoresQueryVariables
    >({
      query: GetChampionsTeamCoresDocument,
      // size 미지정 → 2/3/4 모두 반환. limit 30 → 사이즈별 약 10개씩 가정.
      // 클라이언트(ChampionsTeamCoreSection)에서 선택된 size로 필터링 후 TOP 5 표시.
      variables: { format: formatEnum, limit: 30 },
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    }),
  ])

  const topPokemons = bestData?.getBestChampionsPokemon ?? []
  const teamCores = teamCoresData?.championsTeamCores ?? []

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
      <main className="w-full min-h-screen">
        {isMobile ? (
          <ChampionsHomeMobile
            topPokemons={topPokemons}
            teamCores={teamCores}
            formatSlug={formatSlug as ChampionsFormatSlug}
          />
        ) : (
          <ChampionsHomeDesktop
            topPokemons={topPokemons}
            teamCores={teamCores}
            formatSlug={formatSlug as ChampionsFormatSlug}
          />
        )}
      </main>
    </>
  )
}

export default ChampionsFormatHomePage
