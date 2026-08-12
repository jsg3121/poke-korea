'use client'

import MovesListIcon from '~/assets/icons/movesList.svg'
import EmptyStateComponent from '~/components/emptyState/EmptyState.component'
import PokemonBySkillCardComponent from '~/components/moves/PokemonBySkillCard.component'
import { PokemonLearnInfo } from '~/graphql/typeGenerated'
import { useInfiniteScroll } from '~/hook/useInfiniteScroll'
import { useLearnMethodLabels } from '~/hook/useLearnMethodLabels'
import { usePokemonsBySkill } from '~/hook/usePokemonsBySkill'

/**
 * 기술별 포켓몬 목록 (반응형 단일 — UX-008). 구버전 데/모 2벌 MoveDetail.container의
 * "이 기술을 배우는 포켓몬" 영역을 대체한다. UA 분기·display:none 없이
 * CSS(desktop:)만으로 반응(ADR-0007) — ability의 PokemonByAbilityContainer 동형.
 *
 * 카운트 문구는 시각적으로 섹션 제목 역할을 하므로 h2로 승격(스크린리더 구조 탐색).
 * 포켓몬 카드는 도감 카드와 셸을 공유(PokemonBySkillCard). 버전 전환은 URL 세그먼트
 * (page.tsx가 selectedVersionGroupId를 내려줌)라 훅 variables가 바뀌며 재조회된다.
 */

/** LCP 후보(첫 화면 카드)만 eager 로딩 — 모바일 2열 커버 */
const HIGH_PRIORITY_COUNT = 8

interface PokemonBySkillListContainerProps {
  skillId: number
  initialPokemonList: Array<PokemonLearnInfo>
  totalCount: number
  selectedVersionGroupId?: number
}

const PokemonBySkillListContainer = ({
  skillId,
  initialPokemonList,
  totalCount,
  selectedVersionGroupId,
}: PokemonBySkillListContainerProps) => {
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

  // 습득법 라벨은 마스터 쿼리에서 받아 카드에 주입한다 — 습득법이 9종으로 늘었고
  // 앞으로도 추가될 수 있어, 하드코딩 매핑은 신규 값을 enum 원문으로 노출시킨다.
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
        <EmptyStateComponent
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
                <PokemonBySkillCardComponent
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

export default PokemonBySkillListContainer
