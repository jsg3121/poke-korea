import PageHeader from '~/components/PageHeader'
import DesktopChampionsHomeBanner from '~/components/adSlot/DesktopChampionsHomeBanner'
import ChampionsFormatTab from '~/components/champions/ChampionsFormatTab.component'
import ChampionsHeroSection from '~/components/champions/ChampionsHeroSection.component'
import ChampionsHomeSectionHeader from '~/components/champions/ChampionsHomeSectionHeader.component'
import ChampionsQuickLinks from '~/components/champions/ChampionsQuickLinks.component'
import ChampionsTeamCoreSection from '~/components/champions/ChampionsTeamCoreSection.component'
import ChampionsTopCard from '~/components/champions/ChampionsTopCard.component'
import FooterContainer from '~/container/desktop/footer/Footer.container'
import {
  ChampionsMetaSummaryFragment,
  ChampionsTeamCoreFragment,
} from '~/graphql/typeGenerated'
import {
  ChampionsFormatSlug,
  getFormatLabel,
  getFormatShortLabel,
} from '~/utils/championsFormat.util'
import { groupChampionsByTier } from '~/utils/championsTier.util'

interface ChampionsHomeContainerProps {
  topPokemons: ChampionsMetaSummaryFragment[]
  teamCores: ChampionsTeamCoreFragment[]
  formatSlug: ChampionsFormatSlug
}

const ChampionsHomeContainer = ({
  topPokemons,
  teamCores,
  formatSlug,
}: ChampionsHomeContainerProps) => {
  const tierGroups = groupChampionsByTier(topPokemons)
  const sTier = tierGroups.find((g) => g.tier === 'S')?.pokemons ?? []
  const aTier = tierGroups.find((g) => g.tier === 'A')?.pokemons ?? []

  const formatShort = getFormatShortLabel(formatSlug)
  const formatLabel = getFormatLabel(formatSlug)

  return (
    <section className="w-full max-w-[1280px] h-fit mx-auto pb-8 relative px-4">
      <PageHeader
        title={`포켓몬 챔피언스 ${formatShort}`}
        description={`${formatLabel} 메타 분석 · 상위 1760 레이팅 기준`}
      />

      {/* 포맷 토글 (VGC / BSS) */}
      <ChampionsFormatTab
        currentFormat={formatSlug}
        basePath="/champions"
        className="mb-6 desktop:mb-8"
      />

      {/* Hero — S 티어 TOP 3 */}
      <ChampionsHeroSection sTierPokemons={sTier} moreHref="/champions/tier" />

      {/* A 티어 한눈에 보기 */}
      {aTier.length > 0 && (
        <section
          aria-labelledby="atier-heading"
          className="w-full mb-8 desktop:mb-12"
        >
          <div id="atier-heading">
            <ChampionsHomeSectionHeader
              title="A 티어"
              description="메타에서 자주 보이는 포켓몬"
              moreHref="/champions/list"
              moreLabel="도감 전체 보기"
            />
          </div>
          <ul
            className="flex gap-4 overflow-x-auto py-4 -mx-2 px-2 [&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar-thumb]:bg-primary-3 [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-track]:bg-primary-2 [&::-webkit-scrollbar-track]:rounded-xl"
            role="region"
            aria-label="A 티어 포켓몬 슬라이드"
          >
            {aTier.map((pokemon) => (
              <li
                key={`${pokemon.pokemonId}-${pokemon.formCode ?? 'base'}`}
                className="w-[200px] flex-shrink-0"
              >
                <ChampionsTopCard pokemonData={pokemon} isHighPriority />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 빠른 진입 카드 */}
      <ChampionsQuickLinks formatSlug={formatSlug} />

      {/* 팀 코어 페어 TOP 5 */}
      <ChampionsTeamCoreSection teamCores={teamCores} formatSlug={formatSlug} />

      <DesktopChampionsHomeBanner />

      <FooterContainer />
    </section>
  )
}

export default ChampionsHomeContainer
