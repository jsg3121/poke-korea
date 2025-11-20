'use client'

import AbilityDetailComponent from '~/components/ability/AbilityDetail.component'
import PokemonByAbilityCardComponent from '~/components/ability/PokemonByAbilityCard.component'
import { Ability, PokemonWithAbility } from '~/graphql/typeGenerated'
import { usePokemonByAbility } from '~/hook/usePokemonByAbility'
import { useInfiniteScroll } from '~/hook/useInfiniteScroll'
import FooterContainer from '../footer/Footer.container'

interface PokemonByAbilityContainerProps {
  abilityId: number
  initialAbility: Ability
  initialPokemon: Array<PokemonWithAbility>
  totalCount: number
}

const PokemonByAbilityContainer = ({
  abilityId,
  initialAbility,

  initialPokemon,
  totalCount,
}: PokemonByAbilityContainerProps) => {
  const { ability, pokemonList, loadMore, hasNextPage, loading } =
    usePokemonByAbility({
      abilityId,
      initialPokemon,
    })

  const listRef = useInfiniteScroll({
    hasNextPage,
    loadMore,
    rootMargin: '0px 0px 380px 0px',
    dependencies: [pokemonList, hasNextPage, loading],
  })

  const displayAbility = ability || initialAbility

  return (
    <section className="w-full h-full mx-auto py-8 px-5">
      {displayAbility && (
        <AbilityDetailComponent
          abilityData={displayAbility}
          totalCount={totalCount}
        />
      )}
      {pokemonList.length === 0 && !loading && (
        <div className="w-full h-20">
          <p className="w-full text-lg text-gray-700 font-medium text-center">
            이 특성을 가진 포켓몬이 없습니다.
          </p>
        </div>
      )}
      {pokemonList.length > 0 && (
        <div className="w-full grid grid-cols-2 gap-x-4 gap-y-6 justify-items-center justify-between">
          {pokemonList.map((pokemon) => {
            return (
              <PokemonByAbilityCardComponent
                key={`pokemon-ability-${pokemon.id}-${pokemon.formType}`}
                pokemonData={pokemon}
              />
            )
          })}
        </div>
      )}
      <div ref={listRef}>
        <FooterContainer />
      </div>
    </section>
  )
}

export default PokemonByAbilityContainer
