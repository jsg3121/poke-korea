import { Metadata } from 'next'
import { headers } from 'next/headers'
import { GetChampionsTournamentsWithTopTeamDocument } from '~/graphql/gqlGenerated'
import {
  ChampionsFormat,
  GetChampionsTournamentsWithTopTeamQuery,
  GetChampionsTournamentsWithTopTeamQueryVariables,
} from '~/graphql/typeGenerated'
import MobileTabBar from '~/components/MobileTabBar'
import DesktopFooterContainer from '~/container/desktop/footer/Footer.container'
import DesktopHeaderContainer from '~/container/desktop/header/Header.container'
import MobileFooterContainer from '~/container/mobile/footer/Footer.container'
import MobileHeaderContainer from '~/container/mobile/header/Header.container'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import { SITE_NAME, SITE_URL } from '~/constants/seo.constant'
import ChampionsTournamentsListView from '~/views/champions/ChampionsTournamentsList.view'

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

  const headersList = await headers()
  const isMobile = detectUserAgent(headersList.get('user-agent') || '')

  const apolloClient = initializeApollo()
  const { data } = await apolloClient.query<
    GetChampionsTournamentsWithTopTeamQuery,
    GetChampionsTournamentsWithTopTeamQueryVariables
  >({
    query: GetChampionsTournamentsWithTopTeamDocument,
    variables: {
      format: ChampionsFormat.VGC_DOUBLES,
      // 대회 데이터는 소량이라 무한스크롤 없이 전량 로드(사용자 결정, E-3).
      // 페이지네이션 인프라(offset/cursor)가 없어 충분히 큰 limit으로 한 번에 가져온다.
      limit: 1000,
      ...(month ? { month } : {}),
    },
    fetchPolicy: 'network-only',
  })

  const tournaments = data?.championsTournaments ?? []

  // 사용 가능한 월 목록 (응답에서 추출 — null/빈값 제거 + 중복 제거 + 내림차순)
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
      {/* 콘텐츠는 반응형 단일(ChampionsTournamentsListView, ADR-0007). UA 분기는
          전역 크롬(헤더/푸터/탭바) 선택으로만 남는다(E-1 도감·티어와 동일 패턴). */}
      {isMobile ? (
        <main className="w-full min-h-screen">
          <MobileHeaderContainer />
          <ChampionsTournamentsListView
            tournaments={tournaments}
            availableMonths={availableMonths}
            currentMonth={month ?? null}
          />
          <MobileFooterContainer />
          <MobileTabBar />
        </main>
      ) : (
        // h-40 스페이서 = 데스크톱 fixed 헤더(120px) + 챔피언스 SubNav(40px) 실높이.
        // sticky 필터 desktop:top-40과 정합(E-1 도감과 동일).
        <main className="w-full min-h-screen">
          <div className="h-40">
            <DesktopHeaderContainer />
          </div>
          <ChampionsTournamentsListView
            tournaments={tournaments}
            availableMonths={availableMonths}
            currentMonth={month ?? null}
          />
          <DesktopFooterContainer />
        </main>
      )}
    </>
  )
}

export default ChampionsTournamentsListPage
