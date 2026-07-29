'use client'

import { useRouter } from 'next/navigation'
import AbilityIcon from '~/assets/icons/ability.svg'
import AbilityListTopBanner from '~/components/adSlot/AbilityListTopBanner'
import AbilityCardComponent from '~/components/ability/AbilityCard.component'
import AbilityCardSkeletonComponent from '~/components/ability/AbilityCardSkeleton.component'
import AbilityDescriptionBodyComponent from '~/components/ability/AbilityDescriptionBody.component'
import ButtonComponent from '~/components/button/Button.component'
import EmptyStateComponent from '~/components/emptyState/EmptyState.component'
import PageHeaderComponent from '~/components/pageHeader/PageHeader.component'
import { Ability } from '~/graphql/typeGenerated'
import { useAbilityList } from '~/hook/useAbilityList'
import { useInfiniteScroll } from '~/hook/useInfiniteScroll'
import AbilitySearchContainer from './AbilitySearch.container'

/**
 * 특성 도감 목록 (반응형 단일 — UX-007). 구버전 데/모 2벌 AbilityList.container를
 * 대체한다: PageHeader·SearchInput·AbilityCard DS + `grid-cols-1 desktop:auto-fill`
 * 단일 마크업. UA 분기·display:none 없이 CSS(desktop:)만으로 반응(ADR-0007).
 *
 * 섹션 순서(UX-007): 헤더 → 검색(승격, sticky) → "특성이란?"(접이식, 기본 접힘) →
 * 카드 그리드. 검색을 무거운 설명 블록보다 위로 올려 핵심 과업(검색)의 발견성을
 * 높인다. pageSize는 데/모로 갈리던 값을 12로 통일(반응형 단일 컨테이너는 훅 호출이
 * 하나라 뷰포트별 분기가 어색 — SSR 시점엔 뷰포트를 모른다).
 *
 * 광고(RES-004 재도입): 페이지 헤더 바로 아래·검색 앞(기존 위치 복원, 기존 슬롯
 * 재사용 PC 970×250/모바일 320×100). 빈 상태는 EmptyState + "검색어 지우기"
 * CTA(기존엔 텍스트만 있어 이탈 유발). 추가 로드 중엔 카드 스켈레톤(크기 SSOT
 * 공유로 CLS 방지)을 표시한다.
 */

/** 데/모 통일 페이지 크기 */
const PAGE_SIZE = 12

/** 추가 로드 중 표시할 스켈레톤 수 */
const SKELETON_COUNT = 4

interface AbilityListContainerProps {
  initialAbilities: Array<Ability>
  totalCount: number
}

const AbilityListContainer = ({
  initialAbilities,
  totalCount,
}: AbilityListContainerProps) => {
  const router = useRouter()
  const { abilityList, loadMore, hasNextPage, loading } = useAbilityList({
    initialAbilities,
    pageSize: PAGE_SIZE,
  })

  const sentinelRef = useInfiniteScroll({
    hasNextPage,
    loadMore,
    rootMargin: '0px 0px 300px 0px',
    dependencies: [abilityList, hasNextPage],
  })

  const handleReset = () => {
    router.replace('/ability', { scroll: false })
  }

  const isEmpty = abilityList.length === 0 && !loading
  const isLoadingMore = loading && abilityList.length > 0

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 pb-8">
      <PageHeaderComponent
        title="특성 도감"
        description="포켓몬의 숨겨진 특성, 효과를 한눈에! 특성을 확인하고, 어떤 포켓몬이 가지고 있는지 빠르고 쉽게 확인하세요."
      />

      {/* 광고 — 페이지 헤더 바로 아래(검색 앞) */}
      <AbilityListTopBanner />

      <AbilitySearchContainer totalCount={totalCount} />

      {/* "특성이란?" — 기본 접힘. 정적 설명이라 재방문자 스캔 비용을 낮춘다.
          네이티브 details라 JS 없이 동작(최소 구현). 설명 본문은 기존 DS 재사용. */}
      <details className="group mb-6 rounded-2xl bg-primary-4 open:pb-2">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-6 py-3 desktop:py-4 text-base desktop:text-lg font-bold text-primary-1 [&::-webkit-details-marker]:hidden">
          특성이란?
          <span
            aria-hidden="true"
            className="text-primary-2 transition-transform group-open:rotate-180"
          >
            ▾
          </span>
        </summary>
        <AbilityDescriptionBodyComponent />
      </details>

      {isEmpty ? (
        <EmptyStateComponent
          title="검색하신 이름의 특성이 없어요"
          description="다른 검색어로 다시 시도해 보세요"
          icon={<AbilityIcon />}
          action={
            <ButtonComponent variant="secondary" onClick={handleReset}>
              검색어 지우기
            </ButtonComponent>
          }
        />
      ) : (
        <ul
          className="grid grid-cols-1 gap-4 desktop:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] desktop:gap-6"
          aria-label="특성 목록"
        >
          {abilityList.map((ability) => (
            <li key={`ability-id-${ability.id}`} className="w-full">
              <AbilityCardComponent abilityData={ability} />
            </li>
          ))}
          {isLoadingMore &&
            Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <li key={`skeleton-${i}`} className="w-full">
                <AbilityCardSkeletonComponent />
              </li>
            ))}
        </ul>
      )}

      {/* 추가 로드 알림 — 스켈레톤은 aria-hidden이므로 여기서 한 번만 낭독 */}
      {isLoadingMore && (
        <p role="status" className="sr-only">
          특성을 더 불러오는 중
        </p>
      )}

      {/* 자동 로드 sentinel */}
      <div ref={sentinelRef} aria-hidden="true" />
    </section>
  )
}

export default AbilityListContainer
