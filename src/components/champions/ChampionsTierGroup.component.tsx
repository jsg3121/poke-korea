import Link from 'next/link'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import ChampionsTierBadge from './ChampionsTierBadge.component'

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

  const getDisplayName = (pokemon: ChampionsMetaSummaryFragment) =>
    pokemon.formName ? `${pokemon.name} (${pokemon.formName})` : pokemon.name

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 p-4 bg-gray-50 border-b border-gray-200">
        <ChampionsTierBadge tier={tier} />
        <span className="text-sm text-gray-500">{pokemons.length}종</span>
      </div>
      <div className="p-4 flex flex-wrap gap-3">
        {sortedPokemons.map((pokemon) => (
          <Link
            key={pokemon.pokemonId}
            href={`/champions/list/${pokemon.pokemonId}`}
            className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {pokemon.imagePath && (
              <img
                src={`${imageMode}/${pokemon.imagePath}.webp`}
                alt={getDisplayName(pokemon) ?? ''}
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
                loading="lazy"
              />
            )}
            <span className="text-xs text-gray-500 mt-1">
              {pokemon.usageRate?.toFixed(1)}%
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ChampionsTierGroup
