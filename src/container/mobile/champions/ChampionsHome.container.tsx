import MobileChampionsHomeBanner from '~/components/adSlot/MobileChampionsHomeBanner'
import ChampionsFormatTab from '~/components/champions/ChampionsFormatTab.component'
import ChampionsHeroSection from '~/components/champions/ChampionsHeroSection.component'
import ChampionsHomeSectionHeader from '~/components/champions/ChampionsHomeSectionHeader.component'
import ChampionsQuickLinks from '~/components/champions/ChampionsQuickLinks.component'
import ChampionsTeamCoreSection from '~/components/champions/ChampionsTeamCoreSection.component'
import ChampionsTopCard from '~/components/champions/ChampionsTopCard.component'
import PageHeader from '~/components/mobile/PageHeader'
import FooterContainer from '~/container/mobile/footer/Footer.container'
import {
  ChampionsMetaSummaryFragment,
  ChampionsTeamCoreFragment,
} from '~/graphql/typeGenerated'
import {
  ChampionsFormatSlug,
  getFormatIntro,
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
  const formatIntro = getFormatIntro(formatSlug)

  return (
    <section className="w-full h-full mx-auto relative">
      <PageHeader
        title={`포켓몬 챔피언스 ${formatShort}`}
        description={`${formatLabel} 메타 분석`}
      />

      <div className="w-[calc(100%-2rem)] mx-auto">
        {/* 포맷 토글 (VGC / BSS) */}
        <ChampionsFormatTab
          currentFormat={formatSlug}
          basePath="/champions"
          className="mb-3"
        />

        {/* 포맷 안내 캡션 */}
        <p className="mb-6 text-xs text-primary-3 leading-relaxed">
          {formatIntro}
        </p>

        {/* Hero — S 티어 TOP 3 */}
        <ChampionsHeroSection
          sTierPokemons={sTier}
          moreHref="/champions/tier"
        />

        {/* A 티어 한눈에 보기 */}
        {aTier.length > 0 && (
          <section
            aria-labelledby="atier-heading-mobile"
            className="w-full mb-8"
          >
            <div id="atier-heading-mobile">
              <ChampionsHomeSectionHeader
                title="자주 보이는 포켓몬"
                description="S티어를 제외한 메타에서 자주 보이는 포켓몬"
                moreHref="/champions/list"
                moreLabel="도감 전체 보기"
              />
            </div>
            <ul
              className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar-thumb]:bg-primary-2 [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-track]:bg-primary-3 [&::-webkit-scrollbar-track]:rounded-xl"
              role="region"
              aria-label="A 티어 포켓몬 슬라이드"
            >
              {aTier.map((pokemon) => (
                <li
                  key={`${pokemon.pokemonId}-${pokemon.formCode ?? 'base'}`}
                  className="w-[175px] flex-shrink-0 px-1 py-1"
                >
                  <ChampionsTopCard pokemonData={pokemon} isHighPriority />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 팀 코어 페어 TOP 5 */}
        <ChampionsTeamCoreSection
          teamCores={teamCores}
          formatSlug={formatSlug}
        />
        {/* 빠른 진입 카드 */}
        <ChampionsQuickLinks formatSlug={formatSlug} />
      </div>

      <MobileChampionsHomeBanner />

      <FooterContainer />
    </section>
  )
}

export default ChampionsHomeContainer
