'use client'

import Link from 'next/link'
import AbilityIcon from '~/assets/icons/ability.svg'
import AbilityDetailTopBanner from '~/components/adSlot/AbilityDetailTopBanner'
import PokemonByAbilityCardComponent from '~/components/ability/PokemonByAbilityCard.component'
import EmptyStateComponent from '~/components/emptyState/EmptyState.component'
import { Ability, PokemonWithAbility } from '~/graphql/typeGenerated'
import { useInfiniteScroll } from '~/hook/useInfiniteScroll'
import { usePokemonByAbility } from '~/hook/usePokemonByAbility'

/**
 * 특성별 포켓몬 (반응형 단일 — UX-007). 구버전 데/모 2벌 PokemonByAbility.container를
 * 대체한다. UA 분기·display:none 없이 CSS(desktop:)만으로 반응(ADR-0007).
 *
 * 섹션 순서(UX-007): Hero(좌측 정렬 + "← 특성 도감으로 돌아가기") → 카운트 h2(숫자
 * 강조) → 포켓몬 카드 그리드. Hero는 구버전 AbilityDetail(임의값 text-[2.5rem]·모바일
 * 전용 gutter)을 대체해 moves 상세 Hero의 "뒤로가기 + 좌측 제목" 톤으로 통일한다.
 *
 * 카운트 문구는 시각적으로 섹션 제목 역할을 하므로 h2로 승격(스크린리더 구조 탐색).
 * 광고(RES-004 재도입): 특성 설명 헤더 아래·카운트/그리드 앞(기존 슬롯 재사용
 * PC 970×250/모바일 320×100). 포켓몬 카드는 도감 카드와 셸을 공유
 * (PokemonByAbilityCard).
 */

/** LCP 후보(첫 화면 카드)만 eager 로딩 — 모바일 2열 커버 */
const HIGH_PRIORITY_COUNT = 8

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
      {/* Hero — 좌측 정렬, 뒤로가기 링크 */}
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

      {/* 광고 — 특성 설명 헤더 아래·카운트/그리드 앞 */}
      <AbilityDetailTopBanner />

      {isEmpty ? (
        <EmptyStateComponent
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
                <PokemonByAbilityCardComponent
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

export default PokemonByAbilityContainer
