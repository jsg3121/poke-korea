import Link from 'next/link'
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
        <article
          className="w-80 flex-shrink-0 rounded-xl p-6 text-black-2"
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

          <div className="flex gap-2 mb-4">
            {pokemon.types.map((type) => (
              <TagComponent key={type} type={type} />
            ))}
          </div>

          <dl className="grid grid-cols-2 gap-1 text-sm">
            <dt>체력</dt>
            <dd className="text-right">{pokemon.stats?.hp ?? '-'}</dd>
            <dt>공격</dt>
            <dd className="text-right">{pokemon.stats?.attack ?? '-'}</dd>
            <dt>방어</dt>
            <dd className="text-right">{pokemon.stats?.defense ?? '-'}</dd>
            <dt>특수공격</dt>
            <dd className="text-right">
              {pokemon.stats?.specialAttack ?? '-'}
            </dd>
            <dt>특수방어</dt>
            <dd className="text-right">
              {pokemon.stats?.specialDefense ?? '-'}
            </dd>
            <dt>스피드</dt>
            <dd className="text-right">{pokemon.stats?.speed ?? '-'}</dd>
            <dt className="font-bold">합계</dt>
            <dd className="text-right font-bold">
              {pokemon.stats?.total ?? '-'}
            </dd>
          </dl>
        </article>

        <div className="flex-1">
          <ChampionsMetaSection meta={meta} />
        </div>
      </div>
    </>
  )
}

export default ChampionsDetailContainer
