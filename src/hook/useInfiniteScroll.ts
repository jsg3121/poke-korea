import { useCallback, useEffect, useRef } from 'react'

interface UseInfiniteScrollProps {
  hasNextPage: boolean | undefined
  loadMore: () => void
  rootMargin?: string
  dependencies?: Array<any>
  enabled?: boolean
}

/**
 * 무한 스크롤을 위한 IntersectionObserver 훅
 *
 * @param hasNextPage - 다음 페이지 존재 여부
 * @param loadMore - 다음 페이지 로드 함수
 * @param rootMargin - IntersectionObserver rootMargin (기본값: '0px 0px 100px 0px')
 * @param dependencies - useEffect 의존성 배열 (기본값: [])
 * @param enabled - 옵저버 활성화 여부 (기본값: true)
 * @returns listRef - 관찰할 요소에 연결할 ref
 *
 * @example
 * ```tsx
 * const listRef = useInfiniteScroll({
 *   hasNextPage,
 *   loadMore,
 *   rootMargin: '0px 0px 380px 0px', // 모바일
 *   dependencies: [pokemonList],
 * })
 *
 * return <div ref={listRef}>...</div>
 * ```
 */
export const useInfiniteScroll = ({
  hasNextPage,
  loadMore,
  rootMargin = '0px 0px 100px 0px',
  dependencies = [],
  enabled = true,
}: UseInfiniteScrollProps) => {
  const listRef = useRef<HTMLDivElement>(null)

  const observerCallback = useCallback(
    (entries: Array<IntersectionObserverEntry>) => {
      entries.forEach((entry) => {
        const intersectionRatio = entry.intersectionRatio
        if (intersectionRatio > 0 && hasNextPage && enabled) {
          loadMore()
        }
      })
    },
    [hasNextPage, loadMore, enabled],
  )

  useEffect(() => {
    if (!enabled) return

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin,
      threshold: 0,
    })

    if (listRef.current) {
      observer.observe(listRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [observerCallback, rootMargin, enabled, ...dependencies])

  return listRef
}
