import { Metadata } from 'next'

import { SITE_NAME, SITE_URL } from '~/constants/seo.constant'
import { GetChampionsTournamentsWithTopTeamDocument } from '~/graphql/gqlGenerated'
import {
  ChampionsFormat,
  GetChampionsTournamentsWithTopTeamQuery,
  GetChampionsTournamentsWithTopTeamQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/modules/apolloClient.module'
import ChampionsTournamentsList from '~/views/champions/ChampionsTournamentsList.view'

export const revalidate = 86400

const PAGE_TITLE = '포켓몬 VGC 대회 결과'
const PAGE_DESCRIPTION =
  'VGC 더블 배틀 실전 대회 입상팀 풀빌드 아카이브. 우승팀의 포켓몬, 기술, 도구, 특성, 테라스탈 타입을 확인하세요.'

export const generateMetadata = (): Metadata => {
  const url = `${SITE_URL}/champions/tournaments`
  return {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    openGraph: {
      type: 'website',
      url,
      title: `${PAGE_TITLE} - 포케 코리아`,
      locale: 'ko_KR',
      description: PAGE_DESCRIPTION,
      siteName: SITE_NAME,
    },
    alternates: {
      canonical: url,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${PAGE_TITLE} - 포케 코리아`,
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

  const apolloClient = initializeApollo()
  const { data } = await apolloClient.query<
    GetChampionsTournamentsWithTopTeamQuery,
    GetChampionsTournamentsWithTopTeamQueryVariables
  >({
    query: GetChampionsTournamentsWithTopTeamDocument,
    variables: {
      format: ChampionsFormat.VGC_DOUBLES,
      // 페이지네이션 인프라가 없어 충분히 큰 limit으로 한 번에 가져온다.
      limit: 1000,
      ...(month ? { month } : {}),
    },
    fetchPolicy: 'network-only',
  })

  const tournaments = data?.championsTournaments ?? []

  // null 이 섞이면 localeCompare 호출 시 TypeError 로 SSR 크래시되므로 사전 필터링.
  const availableMonths = Array.from(
    new Set(
      tournaments.map((t) => t.month).filter((m): m is string => Boolean(m)),
    ),
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
        item: `${SITE_URL}/champions/double`,
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
      <ChampionsTournamentsList
        tournaments={tournaments}
        availableMonths={availableMonths}
        currentMonth={month ?? null}
      />
    </>
  )
}

export default ChampionsTournamentsListPage
