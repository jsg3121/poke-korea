import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'
import ChampionsTierBadge from './ChampionsTierBadge.component'
import ChampionsTierPokemonItem from './ChampionsTierPokemonItem.component'

interface ChampionsTierGroupProps {
  tier: 'S' | 'A' | 'B' | 'C' | 'D'
  pokemons: ChampionsMetaSummaryFragment[]
}

const ChampionsTierGroup = ({ tier, pokemons }: ChampionsTierGroupProps) => {
  const isEmpty = pokemons.length === 0

  const sortedPokemons = [...pokemons].sort(
    (a, b) => (b.usageRate ?? 0) - (a.usageRate ?? 0),
  )

  const isHighPriorityTier = tier === 'S' || tier === 'A'

  return (
    <div
      id={`tier-${tier}`}
      className="border border-primary-3/50 rounded-xl overflow-hidden scroll-mt-24"
    >
      <div className="flex items-center gap-2 px-4 py-2 bg-primary-4 border-b border-primary-3/50">
        <ChampionsTierBadge tier={tier} />
        <span className="text-base text-primary-1">{pokemons.length}종</span>
      </div>
      <div className="py-4 px-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2">
        {isEmpty ? (
          <p className="w-full text-center text-primary-3 py-8">
            해당 티어에 포켓몬이 없습니다
          </p>
        ) : (
          sortedPokemons.map((pokemon) => (
            <ChampionsTierPokemonItem
              key={pokemon.pokemonId}
              pokemon={pokemon}
              isHighPriority={isHighPriorityTier}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default ChampionsTierGroup
