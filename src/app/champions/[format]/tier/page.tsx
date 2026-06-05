import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import {
  GetChampionsMetaSummaryByFilterDocument,
  GetChampionsTeamCoresDocument,
} from '~/graphql/gqlGenerated'
import {
  GetChampionsMetaSummaryByFilterQuery,
  GetChampionsMetaSummaryByFilterQueryVariables,
  GetChampionsTeamCoresQuery,
  GetChampionsTeamCoresQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import {
  buildChampionsDetailHref,
  ChampionsFormatSlug,
  parseFormatSlug,
  resolveFormatEnum,
} from '~/utils/championsFormat.util'
import ChampionsTierDesktop from '~/views/desktop/champions/ChampionsTier.desktop'
import ChampionsTierMobile from '~/views/mobile/champions/ChampionsTier.mobile'
import { generateChampionsTierMetadata } from '../../_metadata/championsMetadata'

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
      title: '포켓몬 챔피언스 티어 리스트 | 포케코리아',
      robots: { index: false, follow: false },
    }
  }

  return generateChampionsTierMetadata(formatSlug)
}

const ChampionsFormatTierPage = async ({ params }: PageProps) => {
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

  const [{ data: metaData }, { data: teamCoresData }] = await Promise.all([
    apolloClient.query<
      GetChampionsMetaSummaryByFilterQuery,
      GetChampionsMetaSummaryByFilterQueryVariables
    >({
      query: GetChampionsMetaSummaryByFilterDocument,
      variables: {
        filter: { format: formatEnum },
      },
      fetchPolicy: 'network-only',
    }),
    apolloClient.query<
      GetChampionsTeamCoresQuery,
      GetChampionsTeamCoresQueryVariables
    >({
      query: GetChampionsTeamCoresDocument,
      // size 미지정 → 2/3/4 모두. limit 30 → 사이즈별 약 10개씩 가정.
      // 클라이언트(ChampionsTierTeamCoreSection)에서 사이즈별 TOP 3 추출.
      variables: { format: formatEnum, limit: 30 },
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    }),
  ])

  const metaSummary = metaData?.getChampionsMetaSummary || []
  const teamCores = teamCoresData?.championsTeamCores ?? []

  const tierGroups = {
    S: metaSummary.filter((p) => p.tier === 'S'),
    A: metaSummary.filter((p) => p.tier === 'A'),
    B: metaSummary.filter((p) => p.tier === 'B'),
    C: metaSummary.filter((p) => p.tier === 'C'),
    D: metaSummary.filter((p) => p.tier === 'D'),
  }

  // 갱신 시각: 응답 중 가장 최신 updatedAt 사용
  const latestUpdatedAt = metaSummary
    .map((p) => p.updatedAt)
    .filter((s): s is string => Boolean(s))
    .sort()
    .at(-1)

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
        name: '티어 리스트',
        item: `https://poke-korea.com/champions/${formatSlug}/tier`,
      },
    ],
  }

  // ItemList JSON-LD: 상위 티어(S/A/B) 의 실제 포켓몬을 URL 과 함께 노출.
  // Google ItemList 가이드에 따라 각 항목에 탐색 가능한 url 을 포함해야 색인 가치가 있다.
  // Why: 기존엔 S~D 티어 그룹 5개만 나열 → 탐색 가능한 URL 없어 색인 효과 없음.
  const tierListItems = (['S', 'A', 'B'] as const)
    .flatMap((tier) => tierGroups[tier])
    .slice(0, 20) // 상위 20개로 제한 (Google 권장 범위)
    .map((pokemon, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: pokemon.name ?? '',
      url: `https://poke-korea.com${buildChampionsDetailHref({
        formatSlug,
        pokemonId: pokemon.pokemonId,
        formType: pokemon.formType,
        formCode: pokemon.formCode,
      })}`,
    }))

  const tierListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '포켓몬 챔피언스 티어 리스트',
    description: `포켓몬 챔피언스에 등장하는 ${metaSummary.length}종 포켓몬의 티어별 분류`,
    numberOfItems: metaSummary.length,
    itemListElement: tierListItems,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tierListJsonLd) }}
      />
      <main className="w-full min-h-screen">
        {isMobile ? (
          <ChampionsTierMobile
            tierGroups={tierGroups}
            teamCores={teamCores}
            formatSlug={formatSlug as ChampionsFormatSlug}
            latestUpdatedAt={latestUpdatedAt}
          />
        ) : (
          <ChampionsTierDesktop
            tierGroups={tierGroups}
            teamCores={teamCores}
            formatSlug={formatSlug as ChampionsFormatSlug}
            latestUpdatedAt={latestUpdatedAt}
          />
        )}
      </main>
    </>
  )
}

export default ChampionsFormatTierPage
