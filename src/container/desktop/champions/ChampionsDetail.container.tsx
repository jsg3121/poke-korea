import Link from 'next/link'
import StatChartComponent from '~/components/chart/StatChart.component'
import TagComponent from '~/components/Tag.component'
import ChampionsMetaSection from '~/components/champions/ChampionsMetaSection.component'
import { ChampionsPokemonDetailFragment } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import {
  getBackgroundColor,
  pokemonNumberFormat,
} from '~/module/pokemonCard.module'

interface ChampionsDetailContainerProps {
  detail: ChampionsPokemonDetailFragment
}

const ChampionsDetailContainer = ({
  detail,
}: ChampionsDetailContainerProps) => {
  const { pokemon, meta } = detail
  const pokemonNumber = pokemonNumberFormat(pokemon.pokemonNumber)
  const backgroundColor = getBackgroundColor(pokemon.types)
  const displayName = pokemon.formName
    ? `${pokemon.name} (${pokemon.formName})`
    : pokemon.name

  const gradientStyle =
    backgroundColor.length === 1
      ? { backgroundColor: backgroundColor[0] }
      : {
          backgroundImage: `linear-gradient(135deg, ${backgroundColor[0]} 35%, ${backgroundColor[1]} 65%)`,
        }

  return (
    <>
      <nav className="mb-6 flex items-center justify-between">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link
              href="/champions"
              className="hover:text-primary-2 transition-colors"
            >
              챔피언스
            </Link>
          </li>
          <li className="text-gray-300">/</li>
          <li>
            <Link
              href="/champions/list"
              className="hover:text-primary-2 transition-colors"
            >
              포켓몬 도감
            </Link>
          </li>
          <li className="text-gray-300">/</li>
          <li className="text-gray-900 font-medium">{displayName}</li>
        </ol>
        <Link
          href={`/detail/${pokemon.pokemonNumber}`}
          className="px-4 py-2 text-sm bg-primary-1 text-primary-4 rounded-lg hover:bg-primary-2 transition-colors"
        >
          도감에서 자세히 보기
        </Link>
      </nav>

      <div className="flex gap-8">
        <aside className="w-96 flex-shrink-0 sticky top-32 self-start">
          <article
            className="rounded-xl p-6 text-black-2 mb-4"
            style={gradientStyle}
          >
            <header className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium">No.{pokemonNumber}</span>
              <h1 className="text-xl font-bold">{displayName}</h1>
            </header>

            <div className="flex justify-center mb-4">
              {pokemon.imagePath && (
                <img
                  src={`${imageMode}/${pokemon.imagePath}.webp`}
                  alt={displayName}
                  width={256}
                  height={256}
                  className="w-64 h-64 object-contain"
                />
              )}
            </div>

            <div className="flex gap-2 justify-center">
              {pokemon.types.map((type) => (
                <TagComponent key={type} type={type} />
              ))}
            </div>
          </article>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <header className="mb-2">
              <h2 className="text-sm font-bold text-gray-700">능력치</h2>
              <span className="text-xs text-gray-500">
                총 합: {pokemon.stats?.total ?? '-'}
              </span>
            </header>
            <div className="w-full aspect-square">
              {pokemon.stats && (
                <StatChartComponent stats={pokemon.stats} size="sm" />
              )}
            </div>
          </div>
        </aside>

        <main className="flex-1 max-h-[calc(100vh-12rem)] overflow-y-auto">
          <ChampionsMetaSection meta={meta} />
        </main>
      </div>
    </>
  )
}

export default ChampionsDetailContainer
