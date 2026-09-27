import { PokemonInfoFragment, PokemonType } from '~/graphql/typeGenerated'
import { getTypeLabel } from '~/modules/typeParams.module'
import LinkButton from '~/components/button/LinkButton.component'
import HorizontalScrollList from '~/components/horizontalScrollList/HorizontalScrollList.component'
import PokemonCard from '~/components/pokemonCard/PokemonCard.component'

interface TypeDetailPokemonProps {
  pokemonType: PokemonType
  pokemons: Array<PokemonInfoFragment>
  totalCount: number
}

const TypeDetailPokemon = ({
  pokemonType,
  pokemons,
  totalCount,
}: TypeDetailPokemonProps) => {
  if (pokemons.length === 0) return null

  const label = getTypeLabel(pokemonType)

  return (
    <section
      aria-labelledby="type-detail-pokemon"
      className="w-full pt-10 desktop:pt-14"
    >
      <h2
        id="type-detail-pokemon"
        className="mb-2 text-xl font-semibold leading-tight text-primary-4 desktop:text-3xl"
      >
        {label} 타입 포켓몬
      </h2>
      <p className="mb-4 text-sm text-primary-3">
        {totalCount > 0
          ? `${label} 타입 포켓몬은 전부 ${totalCount}종이에요. 그중 널리 알려진 ${pokemons.length}종을 보여드려요.`
          : `널리 알려진 ${label} 타입 포켓몬 ${pokemons.length}종이에요.`}
      </p>
      <HorizontalScrollList aria-label={`${label} 타입 포켓몬 목록`}>
        {pokemons.map((pokemon, index) => (
          <PokemonCard
            key={pokemon.id}
            pokemonData={pokemon}
            variant="pokedex"
            isHighPriority={index === 0}
          />
        ))}
      </HorizontalScrollList>
      <div className="mt-5">
        <LinkButton
          href={`/list?type=${pokemonType}`}
          variant="secondary"
          showArrow
        >
          {label} 타입 포켓몬 전체 보기
        </LinkButton>
      </div>
    </section>
  )
}

export default TypeDetailPokemon
