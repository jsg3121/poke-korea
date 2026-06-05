import { Metadata } from 'next'
import { headers } from 'next/headers'
import { GetChampionsTournamentsWithTopTeamDocument } from '~/graphql/gqlGenerated'
import {
  ChampionsFormat,
  GetChampionsTournamentsWithTopTeamQuery,
  GetChampionsTournamentsWithTopTeamQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import { SITE_NAME, SITE_URL } from '~/constants/seo.constant'
import ChampionsTournamentsListDesktop from '~/views/desktop/champions/ChampionsTournamentsList.desktop'
import ChampionsTournamentsListMobile from '~/views/mobile/champions/ChampionsTournamentsList.mobile'

export const revalidate = 86400

const PAGE_TITLE = '포켓몬 VGC 대회 결과 | 포케코리아'
const PAGE_DESCRIPTION =
  'VGC 더블 배틀 실전 대회 입상팀 풀빌드 아카이브. 우승팀의 포켓몬, 기술, 아이템, 특성, 테라스탈 타입을 확인하세요.'

export const generateMetadata = (): Metadata => {
  const url = `${SITE_URL}/champions/tournaments`
  return {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    openGraph: {
      type: 'website',
      url,
      title: PAGE_TITLE,
      locale: 'ko_KR',
      description: PAGE_DESCRIPTION,
      siteName: SITE_NAME,
    },
    alternates: {
      canonical: url,
    },
    twitter: {
      card: 'summary_large_image',
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
  }
}

interface PageProps {
  searchParams: Promise<{ month?: string }>
}

const ChampionsTournamentsListPage = async ({ searchParams }: PageProps) => {
  const { month } = await searchParams

  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const apolloClient = initializeApollo()
  const { data } = await apolloClient.query<
    GetChampionsTournamentsWithTopTeamQuery,
    GetChampionsTournamentsWithTopTeamQueryVariables
  >({
    query: GetChampionsTournamentsWithTopTeamDocument,
    variables: {
      format: ChampionsFormat.VGC_DOUBLES,
      limit: 12,
      ...(month ? { month } : {}),
    },
    fetchPolicy: 'network-only',
  })

  const tournaments = data?.championsTournaments ?? []

  // 사용 가능한 월 목록 (응답에서 추출 — 중복 제거 + 내림차순)
  const availableMonths = Array.from(
    new Set(tournaments.map((t) => t.month)),
  ).sort((a, b) => b.localeCompare(a))

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '홈',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '챔피언스',
        item: `${SITE_URL}/champions/vgc`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: '대회',
        item: `${SITE_URL}/champions/tournaments`,
      },
    ],
  }

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '포켓몬 VGC 대회 결과 목록',
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}/champions/tournaments`,
    numberOfItems: tournaments.length,
    itemListElement: tournaments.slice(0, 12).map((t, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/champions/tournaments/${t.externalId}`,
      name: t.name,
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
          <ChampionsTournamentsListMobile
            tournaments={tournaments}
            availableMonths={availableMonths}
            currentMonth={month ?? null}
          />
        ) : (
          <ChampionsTournamentsListDesktop
            tournaments={tournaments}
            availableMonths={availableMonths}
            currentMonth={month ?? null}
          />
        )}
      </main>
    </>
  )
}

export default ChampionsTournamentsListPage
