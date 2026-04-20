import PageHeader from '~/components/PageHeader'
import ChampionsTopCard from '~/components/champions/ChampionsTopCard.component'
import FooterContainer from '~/container/desktop/footer/Footer.container'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'

interface ChampionsHomeContainerProps {
  topPokemons: ChampionsMetaSummaryFragment[]
}

const ChampionsHomeContainer = ({
  topPokemons,
}: ChampionsHomeContainerProps) => {
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
          인기 포켓몬 Top 10
        </h2>

        {(['S', 'A', 'B', 'C', 'D'] as const).map((tier) => {
          const tierPokemons = topPokemons.filter((p) => p.tier === tier)
          if (tierPokemons.length === 0) return null
          return (
            <div key={tier} className="mb-10">
              <h3 className="text-[1.75rem] font-bold text-primary-4 mb-4 text-center">
                {tier} 티어
              </h3>
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${tierPokemons.length}, 1fr)`,
                  maxWidth:
                    tierPokemons.length < 6
                      ? `${tierPokemons.length * 200}px`
                      : '100%',
                  margin: tierPokemons.length < 6 ? '0 auto' : undefined,
                }}
              >
                {tierPokemons.map((pokemon) => (
                  <ChampionsTopCard
                    key={pokemon.pokemonId}
                    pokemonData={pokemon}
                    isHighPriority
                  />
                ))}
              </div>
            </div>
          )
        })}
      </section>

      <FooterContainer />
    </section>
  )
}

export default ChampionsHomeContainer
