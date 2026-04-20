import ChampionsTopCardMobile from '~/components/champions/ChampionsTopCardMobile.component'
import PageHeader from '~/components/mobile/PageHeader'
import FooterContainer from '~/container/mobile/footer/Footer.container'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'

interface ChampionsHomeContainerProps {
  topPokemons: ChampionsMetaSummaryFragment[]
}

const ChampionsHomeContainer = ({
  topPokemons,
}: ChampionsHomeContainerProps) => {
  return (
    <section className="w-full h-full mx-auto relative">
      <PageHeader
        title="포켓몬 챔피언스"
        description={`포켓몬 챔피언스 186종 도감, 티어 리스트, 메타 분석`}
      />
      <section
        className="w-[calc(100%-2.5rem)] mx-auto"
        aria-labelledby="top-pokemon-heading"
      >
        <h2
          id="top-pokemon-heading"
          className="h-10 text-[1.5rem] font-bold text-primary-4 text-center mb-4"
        >
          인기 포켓몬 Top 10
        </h2>

        {(['S', 'A', 'B', 'C', 'D'] as const).map((tier) => {
          const tierPokemons = topPokemons.filter((p) => p.tier === tier)
          if (tierPokemons.length === 0) return null
          return (
            <div key={tier} className="mb-8">
              <h3 className="text-[1.25rem] font-bold text-primary-4 mb-5 text-center">
                {tier} 티어
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {tierPokemons.map((pokemon) => (
                  <ChampionsTopCardMobile
                    key={pokemon.pokemonId}
                    pokemonData={pokemon}
                    isHighPriority={tier === 'S'}
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
