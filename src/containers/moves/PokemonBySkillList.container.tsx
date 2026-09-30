'use client'

import MovesListIcon from '~/assets/icons/movesList.svg'
import { PokemonLearnInfo } from '~/graphql/typeGenerated'
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll'
import { useLearnMethodLabels } from '~/hooks/useLearnMethodLabels'
import { usePokemonsBySkill } from '~/hooks/usePokemonsBySkill'
import EmptyState from '~/components/emptyState/EmptyState.component'
import PokemonBySkillCard from '~/components/moves/PokemonBySkillCard.component'

const HIGH_PRIORITY_COUNT = 8

interface PokemonBySkillListProps {
  skillId: number
  initialPokemonList: Array<PokemonLearnInfo>
  totalCount: number
  selectedVersionGroupId?: number
}

const PokemonBySkillList = ({
  skillId,
  initialPokemonList,
  totalCount,
  selectedVersionGroupId,
}: PokemonBySkillListProps) => {
  const {
    pokemonList,
    loadMore,
    hasNextPage,
    loading,
    totalCount: filteredTotalCount,
  } = usePokemonsBySkill({
    skillId,
    versionGroupId: selectedVersionGroupId,
    initialPokemonList,
  })

  const { getLabel } = useLearnMethodLabels()

  const sentinelRef = useInfiniteScroll({
    hasNextPage,
    loadMore,
    rootMargin: '0px 0px 300px 0px',
    dependencies: [pokemonList, hasNextPage],
  })

  const isEmpty = pokemonList.length === 0 && !loading
  const displayCount = filteredTotalCount || totalCount

  return (
    <section className="w-full">
      {isEmpty ? (
        <EmptyState
          title="이 기술을 배울 수 있는 포켓몬이 없어요"
          description="다른 버전을 선택하거나 기술 도감으로 돌아가 보세요"
          icon={<MovesListIcon />}
        />
      ) : (
        <>
          <h2 className="mb-6 text-base desktop:text-lg text-primary-3 desktop:mb-8">
            <span className="text-xl desktop:text-2xl font-bold text-primary-4">
              {displayCount}마리
            </span>
            의 포켓몬이 이 기술을 배울 수 있어요
          </h2>

          <ul className="grid grid-cols-2 gap-x-4 gap-y-6 justify-items-center desktop:grid-cols-[repeat(auto-fill,minmax(14rem,1fr))]">
            {pokemonList.map((pokemon, index) => (
              <li
                key={`pokemon-skill-${pokemon.id}-${pokemon.formType}`}
                className="w-full"
              >
                <PokemonBySkillCard
                  pokemonData={pokemon}
                  isHighPriority={index < HIGH_PRIORITY_COUNT}
                  getMethodLabel={getLabel}
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

export default PokemonBySkillList
