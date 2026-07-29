import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import {
  GetBestChampionsPokemonDocument,
  GetChampionsTeamCoresDocument,
  GetChampionsTournamentsWithTopTeamDocument,
} from '~/graphql/gqlGenerated'
import {
  ChampionsFormat,
  GetBestChampionsPokemonQuery,
  GetBestChampionsPokemonQueryVariables,
  GetChampionsTeamCoresQuery,
  GetChampionsTeamCoresQueryVariables,
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
import ChampionsHomeView from '~/views/champions/ChampionsHome.view'
import { generateChampionsHomeMetadata } from '../_metadata/championsMetadata'
import { getChampionsHomeJsonLd } from '~/constants/championsJsonLd'
import {
  ChampionsFormatSlug,
  getFormatDescription,
  getFormatShortLabel,
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
      title: '포켓몬 챔피언스 도감',
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

  const [
    { data: bestData },
    { data: teamCoresData },
    { data: tournamentsData },
  ] = await Promise.all([
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
    // Phase 5: 최근 대회 섹션용 - 더블(VGC)만 데이터 있고 싱글 홈에선 섹션 자체 미노출.
    // formatSlug === 'double' 일 때만 네트워크 호출, 싱글은 빈 응답으로 단락.
    formatSlug === 'double'
      ? apolloClient.query<
          GetChampionsTournamentsWithTopTeamQuery,
          GetChampionsTournamentsWithTopTeamQueryVariables
        >({
          query: GetChampionsTournamentsWithTopTeamDocument,
          variables: { format: ChampionsFormat.VGC_DOUBLES, limit: 3 },
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        })
      : Promise.resolve({
          data: {
            championsTournaments: [],
          } as GetChampionsTournamentsWithTopTeamQuery,
        }),
  ])

  const topPokemons = bestData?.getBestChampionsPokemon ?? []
  const teamCores = teamCoresData?.championsTeamCores ?? []
  const recentTournaments = tournamentsData?.championsTournaments ?? []

  const formatShort = getFormatShortLabel(formatSlug)
  const webPageJsonLd = getChampionsHomeJsonLd({
    formatSlug,
    name: `포켓몬 챔피언스 ${formatShort} 도감`,
    description: `${getFormatDescription(formatSlug)} 분석 — 포켓몬 채택 순위와 티어, 인기 기술·도구·특성, 팀 조합 정보를 확인하세요.`,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      {/* 콘텐츠는 반응형 단일(ChampionsHomeView, ADR-0007). UA 분기는 전역 크롬
          (헤더/푸터/탭바) 선택으로만 남는다(티어·도감 개편과 동일 패턴). */}
      {isMobile ? (
        <main className="w-full min-h-screen">
          <MobileHeaderContainer />
          <ChampionsHomeView
            topPokemons={topPokemons}
            teamCores={teamCores}
            recentTournaments={recentTournaments}
            formatSlug={formatSlug as ChampionsFormatSlug}
          />
          <MobileFooterContainer />
          <MobileTabBar />
        </main>
      ) : (
        // h-40 스페이서 = 데스크톱 fixed 헤더(120px) + 챔피언스 SubNav(40px) 실높이.
        <main className="w-full min-h-screen">
          <div className="h-40">
            <DesktopHeaderContainer />
          </div>
          <ChampionsHomeView
            topPokemons={topPokemons}
            teamCores={teamCores}
            recentTournaments={recentTournaments}
            formatSlug={formatSlug as ChampionsFormatSlug}
          />
          <DesktopFooterContainer />
        </main>
      )}
    </>
  )
}

export default ChampionsFormatHomePage
