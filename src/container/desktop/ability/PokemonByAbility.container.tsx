'use client'

import AbilityDetailComponent from '~/components/ability/AbilityDetail.component'
import PokemonByAbilityCardComponent from '~/components/ability/PokemonByAbilityCard.component'
import { Ability, PokemonWithAbility } from '~/graphql/typeGenerated'
import { usePokemonByAbility } from '~/hook/usePokemonByAbility'
import { useInfiniteScroll } from '~/hook/useInfiniteScroll'
import FooterContainer from '../footer/Footer.container'
import DesktopAbilityDetailTopBanner from '~/components/adSlot/DesktopAbilityDetailTopBanner'
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
    rootMargin: '0px 0px 100px 0px',
    dependencies: [pokemonList],
  })

  const displayAbility = ability || initialAbility

  return (
    <section className="w-full max-w-[1280px] h-full mx-auto pt-4 pb-8 px-5">
      {displayAbility && (
        <AbilityDetailComponent abilityData={displayAbility} />
      )}
      <DesktopAbilityDetailTopBanner />
      {pokemonList.length === 0 && !loading && (
        <div className="w-full h-[20rem]">
          <p className="w-full text-2xl text-primary-4 font-bold text-center">
            이 특성을 가진 포켓몬이 없습니다.
          </p>
        </div>
      )}
      {pokemonList.length > 0 && (
        <Fragment>
          <p className="text-[1rem] text-primary-3 mb-8">
            <span className="text-[1.25rem] font-bold">{totalCount}마리</span>의
            포켓몬이 이 특성을 가지고 있어요
          </p>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(calc(14rem-10px),auto))] gap-x-4 gap-y-6 justify-items-center justify-between">
            {pokemonList.map((pokemon, index) => {
              return (
                <PokemonByAbilityCardComponent
                  key={`pokemon-ability-${pokemon.id}-${pokemon.formType}`}
                  pokemonData={pokemon}
                  isHighPriority={index < 15}
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
