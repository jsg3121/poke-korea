'use client'

import Link from 'next/link'

import AbilityIcon from '~/assets/icons/ability.svg'
import { Ability, PokemonWithAbility } from '~/graphql/typeGenerated'
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll'
import { usePokemonByAbility } from '~/hooks/usePokemonByAbility'
import PokemonByAbilityCard from '~/components/ability/PokemonByAbilityCard.component'
import AbilityDetailTopBanner from '~/components/adSlot/AbilityDetailTopBanner.component'
import EmptyState from '~/components/emptyState/EmptyState.component'

const HIGH_PRIORITY_COUNT = 8

interface PokemonByAbilityProps {
  abilityId: number
  initialAbility: Ability
  initialPokemon: Array<PokemonWithAbility>
  totalCount: number
}

const PokemonByAbility = ({
  abilityId,
  initialAbility,
  initialPokemon,
  totalCount,
}: PokemonByAbilityProps) => {
  const { ability, pokemonList, loadMore, hasNextPage, loading } =
    usePokemonByAbility({ abilityId, initialPokemon })

  const sentinelRef = useInfiniteScroll({
    hasNextPage,
    loadMore,
    rootMargin: '0px 0px 300px 0px',
    dependencies: [pokemonList, hasNextPage],
  })

  const displayAbility = ability || initialAbility
  const isEmpty = pokemonList.length === 0 && !loading

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 py-6">
      <Link
        href="/ability"
        className="inline-flex h-9 items-center gap-1 rounded-full bg-primary-3 px-4 text-sm font-medium text-primary-1 transition-colors hover:bg-primary-2 hover:text-primary-4"
      >
        ← 특성 도감으로 돌아가기
      </Link>

      {displayAbility && (
        <header className="mt-4 mb-6">
          <h1 className="text-2xl desktop:text-4xl font-bold text-primary-4 leading-tight">
            {displayAbility.name}
          </h1>
          <p className="mt-2 text-base desktop:text-xl font-semibold text-primary-4 leading-relaxed">
            {displayAbility.description}
          </p>
        </header>
      )}

      <AbilityDetailTopBanner />

      {isEmpty ? (
        <EmptyState
          title="이 특성을 가진 포켓몬이 없어요"
          description="다른 특성을 둘러보거나 도감으로 돌아가 보세요"
          icon={<AbilityIcon />}
        />
      ) : (
        <>
          <h2 className="mb-6 text-base desktop:text-lg text-primary-3 desktop:mb-8">
            <span className="text-xl desktop:text-2xl font-bold text-primary-4">
              {totalCount}마리
            </span>
            의 포켓몬이 이 특성을 가지고 있어요
          </h2>

          <ul className="grid grid-cols-2 gap-x-4 gap-y-6 justify-items-center desktop:grid-cols-[repeat(auto-fill,minmax(14rem,1fr))]">
            {pokemonList.map((pokemon, index) => (
              <li
                key={`pokemon-ability-${pokemon.id}-${pokemon.formType}`}
                className="w-full"
              >
                <PokemonByAbilityCard
                  pokemonData={pokemon}
                  isHighPriority={index < HIGH_PRIORITY_COUNT}
                />
              </li>
            ))}
          </ul>
        </>
      )}

      {loading && pokemonList.length > 0 && (
        <p role="status" className="sr-only">
          포켓몬을 더 불러오는 중
        </p>
      )}

      <div ref={sentinelRef} aria-hidden="true" />
    </section>
  )
}

export default PokemonByAbility
