import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { GetChampionsTournamentDetailDocument } from '~/graphql/gqlGenerated'
import {
  GetChampionsTournamentDetailQuery,
  GetChampionsTournamentDetailQueryVariables,
} from '~/graphql/typeGenerated'
import MobileTabBar from '~/components/MobileTabBar'
import DesktopFooterContainer from '~/container/desktop/footer/Footer.container'
import DesktopHeaderContainer from '~/container/desktop/header/Header.container'
import MobileFooterContainer from '~/container/mobile/footer/Footer.container'
import MobileHeaderContainer from '~/container/mobile/header/Header.container'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import { SITE_NAME, SITE_URL } from '~/constants/seo.constant'
import {
  formatKstDate,
  getFormatEnumShortLabel,
} from '~/utils/championsFormat.util'
import ChampionsTournamentDetailView from '~/views/champions/ChampionsTournamentDetail.view'

export const revalidate = 86400

interface PageProps {
  params: Promise<{ externalId: string }>
}

/**
 * generateMetadata + 페이지 본체가 같은 렌더 사이클에서 같은 externalId 로 호출하므로
 * react.cache 로 메모이즈해 중복 네트워크 호출(fetchPolicy: network-only) 방지.
 *
 * 근거: React 공식 — https://react.dev/reference/react/cache
 */
const fetchDetail = cache(async (externalId: string) => {
  const apolloClient = initializeApollo()
  const { data } = await apolloClient.query<
    GetChampionsTournamentDetailQuery,
    GetChampionsTournamentDetailQueryVariables
  >({
    query: GetChampionsTournamentDetailDocument,
    variables: { externalId },
    fetchPolicy: 'network-only',
  })
  return data?.championsTournamentDetail ?? null
})

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { externalId } = await params
  const detail = await fetchDetail(externalId)

  if (!detail) {
    return {
      title: '대회 정보를 찾을 수 없습니다',
      robots: { index: false, follow: false },
    }
  }

  const formatLabel = getFormatEnumShortLabel(detail.format)
  const dateLabel = formatKstDate(detail.date)
  const title = `${detail.name} 대회 결과`
  const description = `${dateLabel ?? detail.month} ${detail.name} ${formatLabel} 대회 입상팀 Top 8 풀빌드.${
    detail.playersCount != null ? ` 참가자 ${detail.playersCount}명.` : ''
  }`
  const url = `${SITE_URL}/champions/tournaments/${detail.externalId}`

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url,
      title: `${title} - 포케 코리아`,
      locale: 'ko_KR',
      description,
      siteName: SITE_NAME,
    },
    alternates: { canonical: url },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - 포케 코리아`,
      description,
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

const ChampionsTournamentDetailPage = async ({ params }: PageProps) => {
  const { externalId } = await params
  const detail = await fetchDetail(externalId)

  if (!detail) {
    notFound()
  }

  const headersList = await headers()
  const isMobile = detectUserAgent(headersList.get('user-agent') || '')

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
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
      {
        '@type': 'ListItem',
        position: 4,
        name: detail.name,
        item: `${SITE_URL}/champions/tournaments/${detail.externalId}`,
      },
    ],
  }

  const sportsEventJsonLd = detail.isOnline
    ? null
    : {
        '@context': 'https://schema.org',
        '@type': 'SportsEvent',
        name: detail.name,
        startDate: detail.date,
        location: {
          '@type': 'Place',
          name: detail.organizerName ?? '대회 장소',
        },
        ...(detail.organizerName && {
          organizer: {
            '@type': 'Organization',
            name: detail.organizerName,
          },
        }),
        url: `${SITE_URL}/champions/tournaments/${detail.externalId}`,
        sport: '포켓몬 VGC 더블 배틀',
      }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {sportsEventJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(sportsEventJsonLd),
          }}
        />
      )}
      {/* 콘텐츠는 반응형 단일(ChampionsTournamentDetailView, ADR-0007). UA 분기는
          전역 크롬(헤더/푸터/탭바) 선택으로만 남는다(E-1 도감·티어와 동일 패턴). */}
      {isMobile ? (
        <main className="w-full min-h-screen">
          <MobileHeaderContainer />
          <ChampionsTournamentDetailView detail={detail} />
          <MobileFooterContainer />
          <MobileTabBar />
        </main>
      ) : (
        // h-40 스페이서 = 데스크톱 fixed 헤더(120px) + 챔피언스 SubNav(40px) 실높이.
        <main className="w-full min-h-screen">
          <div className="h-40">
            <DesktopHeaderContainer />
          </div>
          <ChampionsTournamentDetailView detail={detail} />
          <DesktopFooterContainer />
        </main>
      )}
    </>
  )
}

export default ChampionsTournamentDetailPage
