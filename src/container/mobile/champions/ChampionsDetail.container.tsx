import TagComponent from '~/components/Tag.component'
import ChampionsMetaSection from '~/components/champions/ChampionsMetaSection.component'
import { ChampionsPokemonDetailFragment } from '~/graphql/typeGenerated'
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
      <article
        className="mx-4 mt-4 rounded-xl p-4 text-black-2"
        style={gradientStyle}
      >
        <header className="flex justify-between items-center mb-3">
          <span className="text-base font-medium">No.{pokemonNumber}</span>
          <h1 className="text-lg font-bold">{displayName}</h1>
        </header>

        <div className="flex justify-center mb-3">
          {pokemon.imagePath && (
            <img
              src={pokemon.imagePath}
              alt={displayName}
              width={160}
              height={160}
              className="w-40 h-40 object-contain"
            />
          )}
        </div>

        <div className="flex gap-2 justify-center mb-3">
          {pokemon.types.map((type) => (
            <TagComponent key={type} type={type} />
          ))}
        </div>

        <dl className="grid grid-cols-4 gap-1 text-xs text-center">
          <dt>체력</dt>
          <dt>공격</dt>
          <dt>방어</dt>
          <dt>스피드</dt>
          <dd>{pokemon.stats?.hp ?? '-'}</dd>
          <dd>{pokemon.stats?.attack ?? '-'}</dd>
          <dd>{pokemon.stats?.defense ?? '-'}</dd>
          <dd>{pokemon.stats?.speed ?? '-'}</dd>
          <dt>특공</dt>
          <dt>특방</dt>
          <dt className="col-span-2">합계</dt>
          <dd>{pokemon.stats?.specialAttack ?? '-'}</dd>
          <dd>{pokemon.stats?.specialDefense ?? '-'}</dd>
          <dd className="col-span-2 font-bold">{pokemon.stats?.total ?? '-'}</dd>
        </dl>
      </article>

      <div className="px-4 mt-6">
        <ChampionsMetaSection meta={meta} />
      </div>
    </>
  )
}

export default ChampionsDetailContainer
