'use client'

import { useContext } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import MovesListIcon from '~/assets/icons/movesList.svg'
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll'
import { MovesContext } from '~/context/Moves.context'
import MovesListTopBanner from '~/components/adSlot/MovesListTopBanner.component'
import Button from '~/components/button/Button.component'
import EmptyState from '~/components/emptyState/EmptyState.component'
import MoveListCard from '~/components/moves/moveCard/MoveListCard.component'
import MoveListCardSkeleton from '~/components/moves/moveCard/MoveListCardSkeleton.component'
import PageHeader from '~/components/pageHeader/PageHeader.component'

import MovesFilterBar from './MovesFilterBar.container'
import MovesSearch from './MovesSearch.container'

const SKELETON_COUNT = 4

const MovesListContent = () => {
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

  const handleReset = () => {
    router.replace(pathname, { scroll: false })
  }

  const isEmpty = skillList.length === 0 && !loading
  const isLoadingMore = loading && skillList.length > 0
  const hasAnyQuery = searchParams.size > 0

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 pb-8">
      <PageHeader
        title="포켓몬 기술 도감"
        description="포켓몬이 사용할 수 있는 모든 기술을 한눈에 확인하세요. 타입, 위력, PP, 설명을 확인하고 검색할 수 있습니다."
      />

      <MovesListTopBanner />

      <div className="sticky top-12 z-30 -mx-4 bg-primary-1 px-4 pb-1 pt-4 desktop:top-30">
        <MovesSearch totalCount={totalCount} />
        <MovesFilterBar />
      </div>

      {isEmpty ? (
        <EmptyState
          title="검색하신 조건의 기술이 없어요"
          description="검색어나 필터 조건을 바꿔 다시 시도해 보세요"
          icon={<MovesListIcon />}
          action={
            hasAnyQuery ? (
              <Button variant="secondary" onClick={handleReset}>
                검색·필터 초기화
              </Button>
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
              <MoveListCard moveData={skill} />
            </li>
          ))}
          {isLoadingMore &&
            Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <li key={`skeleton-${i}`} className="w-full">
                <MoveListCardSkeleton />
              </li>
            ))}
        </ul>
      )}

      {isLoadingMore && (
        <p role="status" className="sr-only">
          기술을 더 불러오는 중
        </p>
      )}

      <div ref={sentinelRef} aria-hidden="true" />
    </section>
  )
}

export default MovesListContent
