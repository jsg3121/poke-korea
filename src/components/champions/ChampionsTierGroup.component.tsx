import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'
import ChampionsTierBadge from './ChampionsTierBadge.component'
import ChampionsTierPokemonItem from './ChampionsTierPokemonItem.component'

interface ChampionsTierGroupProps {
  tier: 'S' | 'A' | 'B' | 'C' | 'D'
  pokemons: ChampionsMetaSummaryFragment[]
}

const ChampionsTierGroup = ({ tier, pokemons }: ChampionsTierGroupProps) => {
  if (pokemons.length === 0) {
    return null
  }

  const sortedPokemons = [...pokemons].sort(
    (a, b) => (b.usageRate ?? 0) - (a.usageRate ?? 0),
  )

  const isHighPriorityTier = tier === 'S' || tier === 'A'

  return (
    <div
      id={`tier-${tier}`}
      className="border border-primary-3/50 rounded-xl overflow-hidden scroll-mt-24"
    >
      <div className="flex items-center gap-3 p-4 bg-primary-4 border-b border-primary-3/50">
        <ChampionsTierBadge tier={tier} />
        <span className="text-sm text-gray-500">{pokemons.length}종</span>
      </div>
      <div className="py-4 flex flex-wrap gap-3">
        {sortedPokemons.map((pokemon) => (
          <ChampionsTierPokemonItem
            key={pokemon.pokemonId}
            pokemon={pokemon}
            isHighPriority={isHighPriorityTier}
          />
        ))}
      </div>
    </div>
  )
}

export default ChampionsTierGroup
