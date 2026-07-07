'use client'

import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import PokeballIcon from '~/assets/icons/pokeball.svg'
import ButtonComponent from '~/components/button/Button.component'
import EmptyStateComponent from '~/components/emptyState/EmptyState.component'
import PokemonCardComponent from '~/components/pokemonCard/PokemonCard.component'
import PokemonCardSkeletonComponent from '~/components/pokemonCard/PokemonCardSkeleton.component'
import { ListContext } from '~/context/List.context'
import { useInfiniteScroll } from '~/hook/useInfiniteScroll'

/**
 * 도감 리스트 그리드 (반응형 단일 — UX-004). 구버전 데/모 2벌 List.container를
 * 대체한다: DS PokemonCard + `grid-cols-2 desktop:grid-cols-5` 단일 마크업.
 *
 * 로딩은 하이브리드(RES-002 — 순수 무한스크롤은 도감류 목표 지향 탐색에 부적합):
 * - ~AUTO_LOAD_LIMIT까지: 스크롤 자동 로드(useInfiniteScroll, sentinel)
 * - 상한 도달 후: "더보기" 버튼 클릭 로드 — 푸터 접근·위치 감각·CLS(500ms 규칙) 개선
 * ?page=N SEO 페이지네이션은 백엔드 협의 후 별도 트랙(사용자 결정 2026-07-07).
 *
 * 빈 상태는 EmptyState + "필터 초기화" CTA(재시도 동선 — 기존엔 텍스트만 있어
 * 이탈 유발), 추가 로드 중엔 카드 스켈레톤(크기 SSOT 공유로 CLS 방지)을 표시한다.
 */

/** 스크롤 자동 로드 상한 — 이후는 더보기 버튼 (Baymard 카테고리 50~100 권장의 하한측) */
const AUTO_LOAD_LIMIT = 60

/** 추가 로드 중 표시할 스켈레톤 수 */
const SKELETON_COUNT = 4

/** LCP 후보(첫 화면 카드)만 eager 로딩 — 모바일 2열×3행 / 데스크톱 5열×2행 커버 */
const HIGH_PRIORITY_COUNT = 10

const ListGridContainer = () => {
  const router = useRouter()
  const { pokemonList, loadMore, hasNextPage, isLoadingMore } =
    useContext(ListContext)

  const canAutoLoad = pokemonList.length < AUTO_LOAD_LIMIT

  const sentinelRef = useInfiniteScroll({
    hasNextPage: !!hasNextPage && canAutoLoad,
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
      className="w-full max-w-[1280px] mx-auto px-4 py-6 desktop:px-8 desktop:py-8"
      aria-labelledby="pokemon-list-heading"
    >
      <h2 id="pokemon-list-heading" className="sr-only">
        포켓몬 리스트
      </h2>

      {isEmpty ? (
        <EmptyStateComponent
          title="검색 결과에 맞는 포켓몬이 없어요"
          description="필터 조건을 바꾸거나 초기화해 보세요"
          icon={<PokeballIcon />}
          action={
            <ButtonComponent variant="secondary" onClick={handleReset}>
              필터 초기화
            </ButtonComponent>
          }
        />
      ) : (
        <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-6 justify-items-center desktop:grid-cols-5">
          {pokemonList.map((pokemon, index) => (
            <li key={`pokemon-id-${pokemon.id}`} className="w-full max-w-fit">
              <PokemonCardComponent
                variant="pokedex"
                pokemonData={pokemon}
                isHighPriority={index < HIGH_PRIORITY_COUNT}
              />
            </li>
          ))}
          {isLoadingMore &&
            Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <li key={`skeleton-${i}`} className="w-full max-w-fit">
                <PokemonCardSkeletonComponent />
              </li>
            ))}
        </ul>
      )}

      {/* 추가 로드 알림 — 스켈레톤은 aria-hidden이므로 여기서 한 번만 낭독 */}
      {isLoadingMore && (
        <p role="status" className="sr-only">
          포켓몬을 더 불러오는 중
        </p>
      )}

      {/* 자동 로드 sentinel — 상한 전까지만 활성(훅 내부에서 hasNextPage로 제어) */}
      <div ref={sentinelRef} aria-hidden="true" />

      {hasNextPage && !canAutoLoad && (
        <div className="mt-8 flex justify-center">
          <ButtonComponent
            variant="secondary"
            onClick={loadMore}
            disabled={isLoadingMore}
          >
            포켓몬 더보기
          </ButtonComponent>
        </div>
      )}
    </section>
  )
}

export default ListGridContainer
