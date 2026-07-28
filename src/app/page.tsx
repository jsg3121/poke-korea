import { headers } from 'next/headers'
import { permanentRedirect } from 'next/navigation'
import { Fragment } from 'react'
import { HOME_META } from './_metadata/homeMetadata'
import {
  GetChampionsMetaSummaryByFilterDocument,
  GetDailyQuizPreviewDocument,
  GetDailyRandomPokemonDocument,
} from '~/graphql/gqlGenerated'
import {
  ChampionsFormat,
  GetChampionsMetaSummaryByFilterQuery,
  GetChampionsMetaSummaryByFilterQueryVariables,
  GetDailyQuizPreviewQuery,
  GetDailyQuizPreviewQueryVariables,
  GetDailyRandomPokemonQuery,
  GetDailyRandomPokemonQueryVariables,
} from '~/graphql/typeGenerated'
import DesktopHomeBottomBanner from '~/components/adSlot/DesktopHomeBottomBanner'
import DesktopHomeTopBanner from '~/components/adSlot/DesktopHomeTopBanner'
import MobileHomeBottomBanner from '~/components/adSlot/MobileHomeBottomBanner'
import MobileHomeTopBanner from '~/components/adSlot/MobileHomeTopBanner'
import MobileTabBar from '~/components/MobileTabBar'
import DesktopFooterContainer from '~/container/desktop/footer/Footer.container'
import DesktopHeaderContainer from '~/container/desktop/header/Header.container'
import MobileFooterContainer from '~/container/mobile/footer/Footer.container'
import MobileHeaderContainer from '~/container/mobile/header/Header.container'
import { WEBSITE_JSON_LD } from '~/constants/websiteJsonLd'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import { compareByUsageRank } from '~/utils/championsFormat.util'
import HomeView from '~/views/home/Home.view'

export const dynamic = 'force-dynamic'

export const metadata = HOME_META

type searchParamsKey =
  | 'name'
  | 'type'
  | 'isMega'
  | 'isRegion'
  | 'isEvolution'
  | 'generation'

type PageProps = {
  searchParams: Promise<{
    [key in searchParamsKey]: string
  }>
}

const HomePage = async ({ searchParams }: PageProps) => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)
  const apolloClient = initializeApollo()

  const params = await searchParams
  const hasFilters = Object.keys(params).length > 0

  // 필터 쿼리 파라미터가 있으면 /list로 308 영구 리다이렉트 (SEO)
  // ⚠️ 중요: 이 리다이렉트는 최소 1년 이상 유지해야 합니다!
  // 배포일: 2025-XX-XX
  // 제거 예정일: 2026-XX-XX 이후
  if (hasFilters) {
    const queryString = new URLSearchParams(params).toString()
    permanentRedirect(`/list?${queryString}`)
  }

  // 매일 변경되는 랜덤 포켓몬 10마리 가져오기
  const { data: pokemonData } = await apolloClient.query<
    GetDailyRandomPokemonQuery,
    GetDailyRandomPokemonQueryVariables
  >({
    query: GetDailyRandomPokemonDocument,
    fetchPolicy: 'network-only',
  })

  // 매일 변경되는 퀴즈 3개 (타입, 특성, 실루엣) 가져오기
  const { data: quizData } = await apolloClient.query<
    GetDailyQuizPreviewQuery,
    GetDailyQuizPreviewQueryVariables
  >({
    query: GetDailyQuizPreviewDocument,
    fetchPolicy: 'network-only',
  })

  // 챔피언스 S 티어 인기 포켓몬 상위 3개 가져오기 (사용률 기준)
  const { data: championsTopData } = await apolloClient.query<
    GetChampionsMetaSummaryByFilterQuery,
    GetChampionsMetaSummaryByFilterQueryVariables
  >({
    query: GetChampionsMetaSummaryByFilterDocument,
    variables: {
      filter: {
        // TODO(Phase 1): format을 라우트 파라미터에서 가져오기
        format: ChampionsFormat.VGC_DOUBLES,
        tier: 'S',
        limit: 3,
      },
    },
    fetchPolicy: 'network-only',
  })

  const dailyPokemon = pokemonData?.getDailyRandomPokemon?.pokemons || []
  const dailyQuiz = quizData?.getDailyQuizPreview
  const topChampionsPokemons = [
    ...(championsTopData?.getChampionsMetaSummary || []),
  ].sort(compareByUsageRank)

  return (
    <Fragment>
      {/* 홈 콘텐츠는 반응형 단일(HomeView, ADR-0007). UA 분기는 아직 데/모 2벌인
          전역 크롬(헤더/푸터/탭바)과 디바이스별 AdSense 유닛 선택으로만 남는다 —
          크롬 통합은 전 페이지 공용이라 별도 트랙에서 진행. */}
      {isMobile ? (
        <main className="w-full min-h-screen">
          <MobileHeaderContainer />
          <HomeView
            dailyPokemon={dailyPokemon}
            dailyQuiz={dailyQuiz}
            topChampionsPokemons={topChampionsPokemons}
            topBanner={<MobileHomeTopBanner />}
            bottomBanner={<MobileHomeBottomBanner />}
          />
          <MobileFooterContainer />
          <MobileTabBar />
        </main>
      ) : (
        <main className="w-full max-w-[1280px] min-h-screen mx-auto pt-40">
          <DesktopHeaderContainer />
          <HomeView
            dailyPokemon={dailyPokemon}
            dailyQuiz={dailyQuiz}
            topChampionsPokemons={topChampionsPokemons}
            topBanner={<DesktopHomeTopBanner />}
            bottomBanner={<DesktopHomeBottomBanner />}
          />
          <DesktopFooterContainer />
        </main>
      )}
      <script
        id="website-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(WEBSITE_JSON_LD),
        }}
      />
    </Fragment>
  )
}

export default HomePage
