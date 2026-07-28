'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import MovesListIcon from '~/assets/icons/movesList.svg'
import MovesListTopBanner from '~/components/adSlot/MovesListTopBanner'
import ButtonComponent from '~/components/button/Button.component'
import EmptyStateComponent from '~/components/emptyState/EmptyState.component'
import MoveListCardComponent from '~/components/moves/moveCard/MoveListCard.component'
import MoveListCardSkeletonComponent from '~/components/moves/moveCard/MoveListCardSkeleton.component'
import PageHeaderComponent from '~/components/pageHeader/PageHeader.component'
import { MovesContext } from '~/context/Moves.context'
import { useInfiniteScroll } from '~/hook/useInfiniteScroll'
import MovesFilterBarContainer from './MovesFilterBar.container'
import MovesSearchContainer from './MovesSearch.container'

/**
 * 기술 도감 목록 (반응형 단일 — UX-008). 구버전 데/모 2벌 MovesList.container를
 * 대체한다: PageHeader·SearchInput·MoveListCard DS + `grid-cols-1 desktop:auto-fill`
 * 단일 마크업. UA 분기·display:none 없이 CSS(desktop:)만으로 반응(ADR-0007).
 *
 * 섹션 순서(UX-008): 헤더 → sticky 크롬(검색 승격 + 접이식 필터바 + 적용 필터 칩)
 * → 카드 그리드. 검색+필터를 한 sticky 블록으로 묶는다 — 스크롤해도 검색·필터가
 * 항상 손 닿는 곳에 있고, sticky 좌표는 전역 헤더 확정값(top-12/desktop:top-30,
 * 구버전 top-28 오프셋 오차 수정 — UX-008 M1).
 *
 * 모바일 그리드는 1열(UX-008 §10-1 시안 비교 후 사용자 확정 — 위력/명중/PP dl
 * 3분할의 넉넉한 밀도 유지), 데스크톱은 auto-fill(minmax 300px)로 3~4열 자동.
 * 데이터는 MovesProvider(context)가 URL 쿼리 기반 필터로 공급한다(구조 유지).
 *
 * 광고(RES-004 재도입): sticky 크롬 뒤·카드 그리드 앞 상단 배너 1개(기존 슬롯
 * 재사용). 인피드(카드 사이)는 커버리지·CTR 붕괴로 재도입하지 않고 상단 배너만
 * 둔다. 컴포넌트가 내부 useDevice로 PC 970×250/모바일 320×100을 분기한다.
 */

/** 추가 로드 중 표시할 스켈레톤 수 (ability/list와 동일 수치) */
const SKELETON_COUNT = 4

const MovesListContainer = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { skillList, totalCount, hasNextPage, loading, loadMore } =
    useContext(MovesContext)

  const sentinelRef = useInfiniteScroll({
    hasNextPage,
    loadMore,
    rootMargin: '0px 0px 300px 0px',
    dependencies: [skillList, hasNextPage],
  })

  // 빈 상태 CTA — 필터만 초기화, 검색어는 검색 인풋에 보이므로 함께 지운다
  // (검색어+필터가 겹쳐 0건이 됐을 때 한 번에 회복)
  const handleReset = () => {
    router.replace(pathname, { scroll: false })
  }

  const isEmpty = skillList.length === 0 && !loading
  const isLoadingMore = loading && skillList.length > 0
  const hasAnyQuery = searchParams.size > 0

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 pb-8">
      <PageHeaderComponent
        title="포켓몬 기술 도감"
        description="포켓몬이 사용할 수 있는 모든 기술을 한눈에 확인하세요. 타입, 위력, PP, 설명을 확인하고 검색할 수 있습니다."
      />

      {/* sticky 크롬 — 검색(상시) + 필터바(접이식) + 적용 필터 칩(상시).
          -mx-4/px-4로 배경(bg-primary-1)을 gutter까지 채워 스크롤 콘텐츠를 가린다 */}
      <div className="sticky top-12 z-30 -mx-4 bg-primary-1 px-4 pb-1 pt-4 desktop:top-30">
        <MovesSearchContainer totalCount={totalCount} />
        <MovesFilterBarContainer />
      </div>

      {/* 상단 광고 — sticky 크롬 뒤·카드 그리드 앞(mt-4로 크롬과 간격 확보) */}
      <div className="mt-4">
        <MovesListTopBanner />
      </div>

      {isEmpty ? (
        <EmptyStateComponent
          title="검색하신 조건의 기술이 없어요"
          description="검색어나 필터 조건을 바꿔 다시 시도해 보세요"
          icon={<MovesListIcon />}
          action={
            hasAnyQuery ? (
              <ButtonComponent variant="secondary" onClick={handleReset}>
                검색·필터 초기화
              </ButtonComponent>
            ) : undefined
          }
        />
      ) : (
        <ul
          className="grid grid-cols-1 gap-4 pt-4 desktop:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] desktop:gap-6"
          aria-label="기술 목록"
        >
          {skillList.map((skill) => (
            <li key={`move-id-${skill.id}`} className="w-full">
              <MoveListCardComponent moveData={skill} />
            </li>
          ))}
          {isLoadingMore &&
            Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <li key={`skeleton-${i}`} className="w-full">
                <MoveListCardSkeletonComponent />
              </li>
            ))}
        </ul>
      )}

      {/* 추가 로드 알림 — 스켈레톤은 aria-hidden이므로 여기서 한 번만 낭독 */}
      {isLoadingMore && (
        <p role="status" className="sr-only">
          기술을 더 불러오는 중
        </p>
      )}

      {/* 자동 로드 sentinel */}
      <div ref={sentinelRef} aria-hidden="true" />
    </section>
  )
}

export default MovesListContainer
