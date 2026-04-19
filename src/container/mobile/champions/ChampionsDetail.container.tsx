import Link from 'next/link'
import StatChartComponent from '~/components/chart/StatChart.component'
import TagComponent from '~/components/Tag.component'
import ChampionsMetaSectionMobile from '~/components/champions/ChampionsMetaSection.mobile.component'
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
      <div className="rounded-xl p-4 mb-4" style={gradientStyle}>
        <nav className="mb-4">
          <ol className="flex items-center gap-2 text-xs text-black-2/70">
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
                도감
              </Link>
            </li>
            <li className="text-black-2/50">/</li>
            <li className="text-black-2 font-bold">{displayName}</li>
          </ol>
        </nav>

        <header className="flex justify-between items-center">
          <span className="text-base font-medium text-black-2">
            No.{pokemonNumber}
          </span>
          <h1 className="text-lg font-bold text-black-2">{displayName}</h1>
        </header>
        <div className="flex justify-center">
          {pokemon.imagePath && (
            <ImageComponent
              src={`${imageMode}/${pokemon.imagePath}.webp`}
              alt={displayName}
              width="17rem"
              height="17rem"
              className="w-50 h-50 object-contain"
              imageSize={{ height: 204, width: 204 }}
            />
          )}
        </div>

        <div className="flex gap-2 justify-center">
          {pokemon.types.map((type) => (
            <TagComponent key={type} type={type} />
          ))}
        </div>
      </div>

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
      <ChampionsMetaSectionMobile meta={meta} />
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
