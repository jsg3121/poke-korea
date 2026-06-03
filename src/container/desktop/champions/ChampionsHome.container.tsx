import PageHeader from '~/components/PageHeader'
import DesktopChampionsHomeBanner from '~/components/adSlot/DesktopChampionsHomeBanner'
import ChampionsTopCard from '~/components/champions/ChampionsTopCard.component'
import FooterContainer from '~/container/desktop/footer/Footer.container'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'
import { ChampionsFormatSlug } from '~/utils/championsFormat.util'
import { groupChampionsByTier } from '~/utils/championsTier.util'

interface ChampionsHomeContainerProps {
  topPokemons: ChampionsMetaSummaryFragment[]
  // TODO(Phase 1): formatSlug를 사용해 신규 섹션(팀 코어, 빠른 진입, 포맷 토글) 통합 예정
  formatSlug: ChampionsFormatSlug
}

const ChampionsHomeContainer = ({
  topPokemons,
}: ChampionsHomeContainerProps) => {
  const tierGroups = groupChampionsByTier(topPokemons)

  return (
    <section className="w-full max-w-[1280px] h-fit mx-auto pb-8 relative">
      <PageHeader
        title="포켓몬 챔피언스"
        description="포켓몬 챔피언스 186종 도감, 티어 리스트, 메타 분석"
      />
      <section aria-labelledby="top-pokemon-heading" className="mb-12">
        <h2
          id="top-pokemon-heading"
          className="h-12 text-[2rem] font-bold text-primary-4 text-center mb-6"
        >
          상위 티어 포켓몬
        </h2>

        {tierGroups.map(({ tier, pokemons }) => (
          <div key={tier} className="mb-10">
            <h3 className="text-[1.75rem] font-bold text-primary-4 mb-4 text-center">
              {tier} 티어
            </h3>
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${pokemons.length}, 1fr)`,
                maxWidth:
                  pokemons.length < 6 ? `${pokemons.length * 200}px` : '100%',
                margin: pokemons.length < 6 ? '0 auto' : undefined,
              }}
            >
              {pokemons.map((pokemon) => (
                <ChampionsTopCard
                  key={`${pokemon.pokemonId}-${pokemon.formCode ?? 'base'}`}
                  pokemonData={pokemon}
                  isHighPriority
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      <DesktopChampionsHomeBanner />

      <FooterContainer />
    </section>
  )
}

export default ChampionsHomeContainer
