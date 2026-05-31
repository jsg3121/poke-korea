import MobileChampionsHomeBanner from '~/components/adSlot/MobileChampionsHomeBanner'
import ChampionsTopCard from '~/components/champions/ChampionsTopCard.component'
import PageHeader from '~/components/mobile/PageHeader'
import FooterContainer from '~/container/mobile/footer/Footer.container'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'
import { groupChampionsByTier } from '~/utils/championsTier.util'

interface ChampionsHomeContainerProps {
  topPokemons: ChampionsMetaSummaryFragment[]
}

const ChampionsHomeContainer = ({
  topPokemons,
}: ChampionsHomeContainerProps) => {
  const tierGroups = groupChampionsByTier(topPokemons)

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
          상위 티어 포켓몬
        </h2>

        {tierGroups.map(({ tier, pokemons }) => (
          <div key={tier} className="mb-8">
            <h3 className="text-[1.25rem] font-bold text-primary-4 mb-5 text-center">
              {tier} 티어
            </h3>
            <ul
              className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar-thumb]:bg-primary-2 [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-track]:bg-primary-3 [&::-webkit-scrollbar-track]:rounded-xl"
              role="region"
              aria-label={`${tier} 티어 포켓몬 슬라이드`}
            >
              {pokemons.map((pokemon) => (
                <li
                  key={`${pokemon.pokemonId}-${pokemon.formCode ?? 'base'}`}
                  className="w-[175px] flex-shrink-0 px-1 py-1"
                >
                  <ChampionsTopCard pokemonData={pokemon} isHighPriority />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <MobileChampionsHomeBanner />

      <FooterContainer />
    </section>
  )
}

export default ChampionsHomeContainer
