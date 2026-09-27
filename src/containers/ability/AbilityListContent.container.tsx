'use client'

import { useRouter } from 'next/navigation'

import AbilityIcon from '~/assets/icons/ability.svg'
import { Ability } from '~/graphql/typeGenerated'
import { useAbilityList } from '~/hooks/useAbilityList'
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll'
import AbilityCard from '~/components/ability/AbilityCard.component'
import AbilityCardSkeleton from '~/components/ability/AbilityCardSkeleton.component'
import AbilityDescriptionBody from '~/components/ability/AbilityDescriptionBody.component'
import AbilityListTopBanner from '~/components/adSlot/AbilityListTopBanner.component'
import Button from '~/components/button/Button.component'
import EmptyState from '~/components/emptyState/EmptyState.component'
import PageHeader from '~/components/pageHeader/PageHeader.component'

import AbilitySearch from './AbilitySearch.container'

const PAGE_SIZE = 12

const SKELETON_COUNT = 4

interface AbilityListContentProps {
  initialAbilities: Array<Ability>
  totalCount: number
}

const AbilityListContent = ({
  initialAbilities,
  totalCount,
}: AbilityListContentProps) => {
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
      <PageHeader
        title="특성 도감"
        description="포켓몬의 숨겨진 특성, 효과를 한눈에! 특성을 확인하고, 어떤 포켓몬이 가지고 있는지 빠르고 쉽게 확인하세요."
      />

      <AbilityListTopBanner />

      <AbilitySearch totalCount={totalCount} />

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
        <AbilityDescriptionBody />
      </details>

      {isEmpty ? (
        <EmptyState
          title="검색하신 이름의 특성이 없어요"
          description="다른 검색어로 다시 시도해 보세요"
          icon={<AbilityIcon />}
          action={
            <Button variant="secondary" onClick={handleReset}>
              검색어 지우기
            </Button>
          }
        />
      ) : (
        <ul
          className="grid grid-cols-1 gap-4 desktop:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] desktop:gap-6"
          aria-label="특성 목록"
        >
          {abilityList.map((ability) => (
            <li key={`ability-id-${ability.id}`} className="w-full">
              <AbilityCard abilityData={ability} />
            </li>
          ))}
          {isLoadingMore &&
            Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <li key={`skeleton-${i}`} className="w-full">
                <AbilityCardSkeleton />
              </li>
            ))}
        </ul>
      )}

      {isLoadingMore && (
        <p role="status" className="sr-only">
          특성을 더 불러오는 중
        </p>
      )}

      <div ref={sentinelRef} aria-hidden="true" />
    </section>
  )
}

export default AbilityListContent
