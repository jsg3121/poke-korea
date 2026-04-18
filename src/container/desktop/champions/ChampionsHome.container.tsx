import Link from 'next/link'
import ChampionsTierBadge from '~/components/champions/ChampionsTierBadge.component'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'

interface ChampionsHomeContainerProps {
  topPokemons: ChampionsMetaSummaryFragment[]
}

const ChampionsHomeContainer = ({
  topPokemons,
}: ChampionsHomeContainerProps) => {
  const getDisplayName = (pokemon: ChampionsMetaSummaryFragment) =>
    pokemon.formName ? `${pokemon.name} (${pokemon.formName})` : pokemon.name

  return (
    <>
      <header className="mb-10 text-center">
        <h1 className="h-12 text-[2.5rem] font-bold text-primary-4">
          포켓몬 챔피언스
        </h1>
        <p className="text-primary-4 mt-2">
          포켓몬 챔피언스 187종 도감, 티어 리스트, 메타 분석
        </p>
      </header>

      <nav className="flex gap-6 mb-12">
        <Link
          href="/champions/pokedex"
          className="flex-1 p-8 bg-primary-2 rounded-xl border border-solid border-primary-3 hover:bg-primary-3 transition-colors"
        >
          <h2 className="text-xl font-bold text-primary-4">포켓몬 도감</h2>
          <p className="text-sm text-primary-4 opacity-80 mt-2">
            챔피언스에 등장하는 포켓몬 목록
          </p>
        </Link>
        <Link
          href="/champions/tier"
          className="flex-1 p-8 bg-primary-2 rounded-xl border border-solid border-primary-3 hover:bg-primary-3 transition-colors"
        >
          <h2 className="text-xl font-bold text-primary-4">티어 리스트</h2>
          <p className="text-sm text-primary-4 opacity-80 mt-2">
            사용률 기반 티어 순위표
          </p>
        </Link>
      </nav>

      <section aria-labelledby="top-pokemon-heading">
        <h2
          id="top-pokemon-heading"
          className="h-12 text-[2rem] font-bold text-primary-4 text-center mb-6"
        >
          인기 포켓몬 TOP 10
        </h2>
        <div className="grid grid-cols-5 gap-6">
          {topPokemons.map((pokemon, index) => (
            <Link
              key={pokemon.pokemonId}
              href={`/champions/pokedex/${pokemon.pokemonId}`}
              className="flex flex-col items-center p-4 bg-primary-2 rounded-xl border border-solid border-primary-3 hover:bg-primary-3 transition-colors"
            >
              <span className="text-sm font-bold text-primary-4 mb-2">
                #{index + 1}
              </span>
              {pokemon.imagePath && (
                <img
                  src={pokemon.imagePath}
                  alt={getDisplayName(pokemon) ?? ''}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain"
                  loading="lazy"
                />
              )}
              <div className="mt-3 flex items-center gap-2">
                <ChampionsTierBadge tier={pokemon.tier} />
              </div>
              <span className="text-sm text-primary-4 mt-2">
                사용률 {pokemon.usageRate?.toFixed(1)}%
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

export default ChampionsHomeContainer
