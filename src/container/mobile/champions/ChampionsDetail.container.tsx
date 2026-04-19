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
      <nav className="mb-4 p-3 bg-primary-4 rounded-xl">
        <ol className="flex items-center gap-2 text-xs text-primary-2">
          <li>
            <Link
              href="/champions"
              className="hover:text-primary-2 transition-colors"
            >
              챔피언스
            </Link>
          </li>
          <li className="text-primary-3">/</li>
          <li>
            <Link
              href="/champions/list"
              className="hover:text-primary-2 transition-colors"
            >
              도감
            </Link>
          </li>
          <li className="text-primary-3">/</li>
          <li className="text-primary-1 font-bold">{displayName}</li>
        </ol>
      </nav>

      <article className="rounded-xl p-4 text-black-2" style={gradientStyle}>
        <header className="flex justify-between items-center mb-3">
          <span className="text-base font-medium">No.{pokemonNumber}</span>
          <h1 className="text-lg font-bold">{displayName}</h1>
        </header>

        <div className="flex justify-center mb-3">
          {pokemon.imagePath && (
            <img
              src={`${imageMode}/${pokemon.imagePath}.webp`}
              alt={displayName}
              width={200}
              height={200}
              className="w-50 h-50 object-contain"
            />
          )}
        </div>

        <div className="flex gap-2 justify-center mb-3">
          {pokemon.types.map((type) => (
            <TagComponent key={type} type={type} />
          ))}
        </div>
      </article>

      <div className="mt-4 bg-primary-4 rounded-xl p-4 mb-6">
        <header className="mb-2">
          <h2 className="text-[1.25rem] font-bold text-primary-1">능력치</h2>
          <span className="text-base text-primary-2">
            총 합: {pokemon.stats?.total ?? '-'}
          </span>
        </header>
        <div className="w-full aspect-square max-w-[280px] mx-auto">
          {pokemon.stats && (
            <StatChartComponent stats={pokemon.stats} size="sm" />
          )}
        </div>
      </div>
      <ChampionsMetaSection meta={meta} />
      <Link
        href={`/detail/${pokemon.pokemonNumber}`}
        className="block w-full mt-6 mb-8 py-3 text-center text-base bg-primary-1 text-primary-4 rounded-lg hover:bg-primary-2 transition-colors"
      >
        도감에서 자세히 보기
      </Link>
    </>
  )
}

export default ChampionsDetailContainer
