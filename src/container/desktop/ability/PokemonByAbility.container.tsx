'use client'

import { useEffect, useRef, useState } from 'react'
import AbilityDetailComponent from '~/components/ability/AbilityDetail.component'
import PokemonByAbilityCardComponent from '~/components/ability/PokemonByAbilityCard.component'
import { usePokemonByAbility } from '~/hook/usePokemonByAbility'
import { Ability, PokemonWithAbility } from '~/graphql/typeGenerated'
import FooterContainer from '../footer/Footer.container'

interface PokemonByAbilityContainerProps {
  abilityId: number
  initialAbility: Ability
  initialPokemon: Array<PokemonWithAbility>
}

const PokemonByAbilityContainer = ({
  abilityId,
  initialAbility,
  initialPokemon,
}: PokemonByAbilityContainerProps) => {
  const listRef = useRef<HTMLDivElement>(null)
  const [includeHidden, setIncludeHidden] = useState(true)

  const { ability, pokemonList, loadMore, hasNextPage, loading } =
    usePokemonByAbility({
      abilityId,
      includeHidden,
      initialPokemon,
    })

  const observerCallback = (entries: Array<IntersectionObserverEntry>) => {
    entries.forEach((entry) => {
      const intersectionRatio = entry.intersectionRatio
      if (intersectionRatio > 0 && hasNextPage && !loading) {
        loadMore()
      }
    })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px 0px 100px 0px',
      threshold: 0,
    })

    if (listRef.current) {
      observer.observe(listRef.current)
    }
    return () => observer.disconnect()
  }, [pokemonList, hasNextPage, loading])

  const displayAbility = ability || initialAbility

  return (
    <section className="w-full max-w-[1280px] min-h-dvh h-full mx-auto py-12 pb-8 px-5">
      {displayAbility && <AbilityDetailComponent abilityData={displayAbility} />}

      <div className="mb-6 flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeHidden}
            onChange={(e) => setIncludeHidden(e.target.checked)}
            className="w-5 h-5 cursor-pointer"
          />
          <span className="text-base text-gray-700 font-medium">
            숨겨진 특성 포함
          </span>
        </label>
      </div>

      {pokemonList.length === 0 && !loading && (
        <div className="w-full h-[20rem]">
          <p className="w-full text-2xl text-gray-700 font-bold text-center">
            이 특성을 가진 포켓몬이 없습니다.
          </p>
        </div>
      )}

      {pokemonList.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-6">
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

      {loading && (
        <div className="flex justify-center py-6 w-full">
          <div className="text-base text-gray-600">
            포켓몬을 불러오는 중...
          </div>
        </div>
      )}

      <div ref={listRef}>
        <FooterContainer />
      </div>
    </section>
  )
}

export default PokemonByAbilityContainer
