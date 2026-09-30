'use client'

import { useContext } from 'react'
import { useRouter } from 'next/navigation'

import PokeballIcon from '~/assets/icons/pokeball.svg'
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll'
import { ListContext } from '~/context/List.context'
import Button from '~/components/button/Button.component'
import EmptyState from '~/components/emptyState/EmptyState.component'
import PokemonCard from '~/components/pokemonCard/PokemonCard.component'
import PokemonCardSkeleton from '~/components/pokemonCard/PokemonCardSkeleton.component'

const SKELETON_COUNT = 4

const HIGH_PRIORITY_COUNT = 10

const ListGrid = () => {
  const router = useRouter()
  const { pokemonList, loadMore, hasNextPage, isLoadingMore } =
    useContext(ListContext)

  const sentinelRef = useInfiniteScroll({
    hasNextPage: !!hasNextPage,
    loadMore,
    rootMargin: '0px 0px 300px 0px',
    dependencies: [pokemonList],
  })

  const handleReset = () => {
    router.replace('/list', { scroll: false })
  }

  const isEmpty = pokemonList.length === 0 && !isLoadingMore

  return (
    <section
      className="w-full max-w-[1280px] mx-auto px-4 py-6"
      aria-labelledby="pokemon-list-heading"
    >
      <h2 id="pokemon-list-heading" className="sr-only">
        포켓몬 리스트
      </h2>

      {isEmpty ? (
        <EmptyState
          title="검색 결과에 맞는 포켓몬이 없어요"
          description="필터 조건을 바꾸거나 초기화해 보세요"
          icon={<PokeballIcon />}
          action={
            <Button variant="secondary" onClick={handleReset}>
              필터 초기화
            </Button>
          }
        />
      ) : (
        <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-6 justify-items-center desktop:grid-cols-5">
          {pokemonList.map((pokemon, index) => (
            <li key={`pokemon-id-${pokemon.id}`} className="w-full">
              <PokemonCard
                variant="pokedex"
                pokemonData={pokemon}
                isHighPriority={index < HIGH_PRIORITY_COUNT}
              />
            </li>
          ))}
          {isLoadingMore &&
            Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <li key={`skeleton-${i}`} className="w-full">
                <PokemonCardSkeleton />
              </li>
            ))}
        </ul>
      )}

      {isLoadingMore && (
        <p role="status" className="sr-only">
          포켓몬을 더 불러오는 중
        </p>
      )}

      <div ref={sentinelRef} aria-hidden="true" />
    </section>
  )
}

export default ListGrid
