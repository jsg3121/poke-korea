import ChampionsInContentBanner from '~/components/adSlot/ChampionsInContentBanner'
import ChampionsFormatIntro from '~/components/champions/ChampionsFormatIntro.component'
import ChampionsHeroSection from '~/components/champions/ChampionsHeroSection.component'
import ChampionsHomeSectionHeader from '~/components/champions/ChampionsHomeSectionHeader.component'
import ChampionsQuickLinks from '~/components/champions/ChampionsQuickLinks.component'
import ChampionsRecentTournamentsSection from '~/components/champions/ChampionsRecentTournamentsSection.component'
import ChampionsTeamCoreSection from '~/components/champions/ChampionsTeamCoreSection.component'
import ChampionsTopCard from '~/components/champions/ChampionsTopCard.component'
import HorizontalScrollListComponent from '~/components/horizontalScrollList/HorizontalScrollList.component'
import PageHeaderComponent from '~/components/pageHeader/PageHeader.component'
import { CHAMPIONS_SLOTS } from '~/constants/adSense'
import {
  ChampionsMetaSummaryFragment,
  ChampionsTeamCoreFragment,
  GetChampionsTournamentsWithTopTeamQuery,
} from '~/graphql/typeGenerated'
import {
  ChampionsFormatSlug,
  getFormatLabel,
  getFormatShortLabel,
} from '~/utils/championsFormat.util'
import { groupChampionsByTier } from '~/utils/championsTier.util'

/**
 * 챔피언스 홈 본문 (반응형 단일, ADR-0007).
 *
 * 구버전 desktop/mobile 2벌 컨테이너를 CSS 반응형 단일로 통합한다(UX-E1).
 * - 제목 헤더는 공통 DS PageHeaderComponent를 쓴다(moves·ability·티어·도감과 통일,
 *   사용자 결정 2026-07-22). h1은 짧게("챔피언스 VGC"), 긴 키워드는 메타 title에만.
 * - champions 고유 요소(포맷 탭 + 안내 캡션)는 헤더와 분리해 ChampionsFormatIntro가
 *   담당한다(관심사 분리).
 * - Hero/A티어 카드는 도감 카드와 동일한 DS 셸(ChampionsTopCard → PokemonCardShell).
 * - 광고(RES-004 재배치): TOP3(Hero)↔자주 보이는 포켓몬(A티어) 사이 1개. 첫
 *   핵심 콘텐츠(TOP3) 소비 직후 폴드 경계 지점(사용자 결정 — 진입 시 조기 노출).
 * - 전역 크롬(헤더/푸터/탭바)은 page.tsx가 담당(컨테이너 내부에 두지 않는다).
 */
interface ChampionsHomeContainerProps {
  topPokemons: ChampionsMetaSummaryFragment[]
  teamCores: ChampionsTeamCoreFragment[]
  recentTournaments: GetChampionsTournamentsWithTopTeamQuery['championsTournaments']
  formatSlug: ChampionsFormatSlug
}

const ChampionsHomeContainer = ({
  topPokemons,
  teamCores,
  recentTournaments,
  formatSlug,
}: ChampionsHomeContainerProps) => {
  const tierGroups = groupChampionsByTier(topPokemons)
  const sTier = tierGroups.find((g) => g.tier === 'S')?.pokemons ?? []
  const aTier = tierGroups.find((g) => g.tier === 'A')?.pokemons ?? []

  const formatShort = getFormatShortLabel(formatSlug)
  const formatLabel = getFormatLabel(formatSlug)

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 pb-8 desktop:mt-12 desktop:px-5">
      <PageHeaderComponent
        title={`챔피언스 ${formatShort}`}
        description={`${formatLabel} 메타 분석`}
      />

      <ChampionsFormatIntro
        formatSlug={formatSlug}
        showIntro
        className="mb-8 desktop:mb-12"
      />

      {/* Hero — S 티어 TOP 3 */}
      <ChampionsHeroSection
        sTierPokemons={sTier}
        moreHref={`/champions/${formatSlug}/tier`}
        formatSlug={formatSlug}
      />

      {/* 광고 — TOP3 소비 직후·자주 보이는 포켓몬 앞(폴드 경계) */}
      <div className="mb-8 desktop:mb-12">
        <ChampionsInContentBanner
          mobileSlot={CHAMPIONS_SLOTS.homeMobile}
          desktopSlot={CHAMPIONS_SLOTS.homeDesktop}
        />
      </div>

      {/* A 티어 한눈에 보기 */}
      {aTier.length > 0 && (
        <section
          aria-labelledby="atier-heading"
          className="w-full mb-8 desktop:mb-12"
        >
          <div id="atier-heading">
            <ChampionsHomeSectionHeader
              title="자주 보이는 포켓몬"
              description="S티어 제외 고 사용률 포켓몬"
              moreHref={`/champions/${formatSlug}/list`}
              moreLabel="도감 전체 보기"
            />
          </div>
          {/* 일반 홈과 동일한 DS 가로 스크롤 사용 — Hero(TOP3)와 함께 메인 홈 카드와
              통일(사용자 피드백 2026-07-27). 자체 마크업이면 DS 폭 변경이 안 먹는다. */}
          <HorizontalScrollListComponent aria-label="A 티어 포켓몬 슬라이드">
            {aTier.map((pokemon) => (
              <ChampionsTopCard
                key={`${pokemon.pokemonId}-${pokemon.formCode ?? 'base'}`}
                pokemonData={pokemon}
                isHighPriority
                formatSlug={formatSlug}
              />
            ))}
          </HorizontalScrollListComponent>
        </section>
      )}

      {/* 팀 코어 페어 TOP 5 */}
      <ChampionsTeamCoreSection teamCores={teamCores} formatSlug={formatSlug} />

      {/* 최근 대회 결과 (VGC만 데이터 있음) */}
      <ChampionsRecentTournamentsSection tournaments={recentTournaments} />

      {/* 빠른 진입 카드 */}
      <ChampionsQuickLinks formatSlug={formatSlug} />
    </section>
  )
}

export default ChampionsHomeContainer
