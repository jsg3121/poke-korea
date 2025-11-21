'use client'

import AbilityDetailComponent from '~/components/ability/AbilityDetail.component'
import PokemonByAbilityCardComponent from '~/components/ability/PokemonByAbilityCard.component'
import { Ability, PokemonWithAbility } from '~/graphql/typeGenerated'
import { usePokemonByAbility } from '~/hook/usePokemonByAbility'
import { useInfiniteScroll } from '~/hook/useInfiniteScroll'
import FooterContainer from '../footer/Footer.container'
import MobileAbilityDetailTopBanner from '~/components/adSlot/MobileAbilityDetailTopBanner'
import { Fragment } from 'react'

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
    <section className="w-full h-full mx-auto py-8">
      {displayAbility && (
        <AbilityDetailComponent abilityData={displayAbility} />
      )}
      <MobileAbilityDetailTopBanner />
      {pokemonList.length === 0 && !loading && (
        <div className="w-[calc(100%-2.5rem)] mx-auto h-20">
          <p className="w-[calc(100%-2.5rem)] mx-auto text-lg text-gray-700 font-medium text-center">
            이 특성을 가진 포켓몬이 없습니다.
          </p>
        </div>
      )}
      {pokemonList.length > 0 && (
        <Fragment>
          <p className="w-[calc(100%-2.5rem)] mx-auto text-[1rem] text-primary-3 mb-8">
            <span className="text-[1.25rem] font-bold">{totalCount}마리</span>의
            포켓몬이 이 특성을 가지고 있어요
          </p>
          <div className="w-[calc(100%-2.5rem)] mx-auto grid grid-cols-2 gap-x-4 gap-y-6 justify-items-center justify-between">
            {pokemonList.map((pokemon) => {
              return (
                <PokemonByAbilityCardComponent
                  key={`pokemon-ability-${pokemon.id}-${pokemon.formType}`}
                  pokemonData={pokemon}
                />
              )
            })}
          </div>
        </Fragment>
      )}
      <div ref={listRef}>
        <FooterContainer />
      </div>
    </section>
  )
}

export default PokemonByAbilityContainer
