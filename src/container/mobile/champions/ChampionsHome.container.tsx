import Link from 'next/link'
import ChampionsTierBadge from '~/components/champions/ChampionsTierBadge.component'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'

interface ChampionsHomeContainerProps {
  topPokemons: ChampionsMetaSummaryFragment[]
}

const ChampionsHomeContainer = ({
  topPokemons,
}: ChampionsHomeContainerProps) => {
  return (
    <>
      <header className="mb-8 text-center">
        <h1 className="h-10 text-[2rem] font-bold text-primary-4">
          포켓몬 챔피언스
        </h1>
        <p className="text-sm text-primary-4 mt-2">
          포켓몬 챔피언스 187종 도감, 티어 리스트, 메타 분석
        </p>
      </header>

      <nav className="flex flex-col gap-3 mb-10">
        <Link
          href="/champions/pokedex"
          className="p-4 bg-primary-2 rounded-xl border border-solid border-primary-3"
        >
          <h2 className="text-base font-bold text-primary-4">포켓몬 도감</h2>
          <p className="text-xs text-primary-4 opacity-80 mt-1">
            챔피언스에 등장하는 포켓몬 목록
          </p>
        </Link>
        <Link
          href="/champions/tier"
          className="p-4 bg-primary-2 rounded-xl border border-solid border-primary-3"
        >
          <h2 className="text-base font-bold text-primary-4">티어 리스트</h2>
          <p className="text-xs text-primary-4 opacity-80 mt-1">
            사용률 기반 티어 순위표
          </p>
        </Link>
      </nav>

      <section aria-labelledby="top-pokemon-heading">
        <h2
          id="top-pokemon-heading"
          className="h-10 text-[1.5rem] font-bold text-primary-4 text-center mb-4"
        >
          인기 포켓몬 TOP 10
        </h2>
        <div className="grid grid-cols-5 gap-2">
          {topPokemons.map((pokemon, index) => (
            <Link
              key={pokemon.pokemonId}
              href={`/champions/pokedex/${pokemon.pokemonId}`}
              className="flex flex-col items-center p-2 bg-primary-2 rounded-lg border border-solid border-primary-3"
            >
              <span className="text-xs font-bold text-primary-4">
                #{index + 1}
              </span>
              {pokemon.imagePath && (
                <img
                  src={`${imageMode}/${pokemon.imagePath}.webp`}
                  alt={pokemon.name ?? ''}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                  loading="lazy"
                />
              )}
              <ChampionsTierBadge tier={pokemon.tier} />
              <span className="text-[10px] text-primary-4 mt-1">
                {pokemon.usageRate?.toFixed(0)}%
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

export default ChampionsHomeContainer
