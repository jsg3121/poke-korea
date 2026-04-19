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
import ImageComponent from '~/components/Image.component'

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
      <div className="rounded-xl p-6 mb-6" style={gradientStyle}>
        <nav className="mb-3 flex items-center justify-between">
          <ol className="flex items-center gap-2 text-sm text-black-2/70">
            <li>
              <Link
                href="/champions"
                className="hover:text-black-2 transition-colors"
              >
                챔피언스
              </Link>
            </li>
            <li className="text-black-2/50">/</li>
            <li>
              <Link
                href="/champions/list"
                className="hover:text-black-2 transition-colors"
              >
                포켓몬 도감
              </Link>
            </li>
            <li className="text-black-2/50">/</li>
            <li className="text-black-2 font-bold">{displayName}</li>
          </ol>
          <Link
            href={`/detail/${pokemon.pokemonNumber}`}
            className="px-4 py-2 text-sm bg-black-2/20 text-black-2 rounded-lg hover:bg-black-2/30 transition-colors"
          >
            도감에서 자세히 보기
          </Link>
        </nav>

        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-black-2">
            No.{pokemonNumber}
          </span>
          <h1 className="text-xl font-bold text-black-2">{displayName}</h1>
        </div>

        <div className="flex justify-center">
          {pokemon.imagePath && (
            <ImageComponent
              src={`${imageMode}/${pokemon.imagePath}.webp`}
              alt={displayName}
              width="18rem"
              height="18rem"
              className="w-72 h-72 object-contain"
              imageSize={{ height: 288, width: 288 }}
            />
          )}
        </div>

        <div className="flex gap-2 justify-center">
          {pokemon.types.map((type) => (
            <TagComponent key={type} type={type} />
          ))}
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="w-[420px] flex-shrink-0">
          <div className="bg-primary-4 rounded-xl p-4">
            <header className="mb-2">
              <h2 className="text-sm font-bold text-primary-1">능력치</h2>
              <span className="text-xs text-primary-2">
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

        <main className="flex-1">
          <ChampionsMetaSection meta={meta} />
        </main>
      </div>
    </>
  )
}

export default ChampionsDetailContainer
