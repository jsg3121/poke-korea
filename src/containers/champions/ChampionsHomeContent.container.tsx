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
import ChampionsInContentBanner from '~/components/adSlot/ChampionsInContentBanner.component'
import ChampionsFormatIntro from '~/components/champions/ChampionsFormatIntro.component'
import ChampionsHeroSection from '~/components/champions/ChampionsHeroSection.component'
import ChampionsHomeSectionHeader from '~/components/champions/ChampionsHomeSectionHeader.component'
import ChampionsQuickLinks from '~/components/champions/ChampionsQuickLinks.component'
import ChampionsRecentTournamentsSection from '~/components/champions/ChampionsRecentTournamentsSection.component'
import ChampionsTeamCoreSection from '~/components/champions/ChampionsTeamCoreSection.component'
import ChampionsTopCard from '~/components/common/ChampionsTopCard.component'
import HorizontalScrollList from '~/components/horizontalScrollList/HorizontalScrollList.component'
import PageHeader from '~/components/pageHeader/PageHeader.component'

interface ChampionsHomeContentProps {
  topPokemons: ChampionsMetaSummaryFragment[]
  teamCores: ChampionsTeamCoreFragment[]
  recentTournaments: GetChampionsTournamentsWithTopTeamQuery['championsTournaments']
  formatSlug: ChampionsFormatSlug
}

const ChampionsHomeContent = ({
  topPokemons,
  teamCores,
  recentTournaments,
  formatSlug,
}: ChampionsHomeContentProps) => {
  const tierGroups = groupChampionsByTier(topPokemons)
  const sTier = tierGroups.find((g) => g.tier === 'S')?.pokemons ?? []
  const aTier = tierGroups.find((g) => g.tier === 'A')?.pokemons ?? []

  const formatShort = getFormatShortLabel(formatSlug)
  const formatLabel = getFormatLabel(formatSlug)

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 pb-8 desktop:mt-12 desktop:px-5">
      <PageHeader
        title={`챔피언스 ${formatShort}`}
        description={`${formatLabel} 메타 분석`}
      />

      <ChampionsFormatIntro
        formatSlug={formatSlug}
        showIntro
        className="mb-8 desktop:mb-12"
      />

      <ChampionsHeroSection
        sTierPokemons={sTier}
        moreHref={`/champions/${formatSlug}/tier`}
        formatSlug={formatSlug}
      />

      <div className="mb-8 desktop:mb-12">
        <ChampionsInContentBanner
          mobileSlot={CHAMPIONS_SLOTS.homeMobile}
          desktopSlot={CHAMPIONS_SLOTS.homeDesktop}
        />
      </div>

      {aTier.length > 0 && (
        <section
          aria-labelledby="atier-heading"
          className="w-full mb-8 desktop:mb-12"
        >
          <div id="atier-heading">
            <ChampionsHomeSectionHeader
              title="자주 보이는 포켓몬"
              description="S티어 제외 상위 채택 포켓몬"
              moreHref={`/champions/${formatSlug}/list`}
              moreLabel="도감 전체 보기"
            />
          </div>
          <HorizontalScrollList aria-label="A 티어 포켓몬 슬라이드">
            {aTier.map((pokemon) => (
              <ChampionsTopCard
                key={`${pokemon.pokemonId}-${pokemon.formCode ?? 'base'}`}
                pokemonData={pokemon}
                isHighPriority
                formatSlug={formatSlug}
              />
            ))}
          </HorizontalScrollList>
        </section>
      )}

      <ChampionsTeamCoreSection teamCores={teamCores} formatSlug={formatSlug} />

      <ChampionsRecentTournamentsSection tournaments={recentTournaments} />

      <ChampionsQuickLinks formatSlug={formatSlug} />
    </section>
  )
}

export default ChampionsHomeContent
