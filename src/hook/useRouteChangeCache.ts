import { useApolloClient } from '@apollo/client'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useCallback, useRef } from 'react'

/**
 * 페이지 이동 시 포켓몬 리스트 캐시 초기화 Hook
 *
 * 배경:
 * - 무한 스크롤로 모든 포켓몬을 불러온 뒤 필터나 다른 페이지 이동 후 뒤로가기 했을 때
 * - 이전 캐싱된 데이터(수백 개의 포켓몬)가 남아있어서 페이지 로딩 시간 증가 및 UX 버벅임 발생
 *
 * 해결:
 * - URL 변경(pathname 또는 searchParams) 감지 시 Apollo Client 캐시에서
 *   GetPokemonListPaginated 쿼리 데이터 제거
 * - 브라우저 뒤로가기/앞으로가기 이벤트도 감지하여 캐시 초기화
 * - 다음 페이지 진입 시 새로운 데이터로 시작하여 성능 개선
 *
 * 동작:
 * 1. pathname, searchParams 변경 감지 (필터 변경, router.replace 등)
 * 2. popstate 이벤트 감지 (브라우저 뒤로가기/앞으로가기)
 * 3. getPokemonListPaginated 필드 캐시 evict + 가비지 컬렉션 실행
 */
export const useRouteChangeCache = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const client = useApolloClient()
  const prevUrl = useRef<string>('')

  const clearPokemonCache = useCallback(() => {
    // GetPokemonListPaginated 쿼리 캐시 초기화
    client.cache.evict({ fieldName: 'getPokemonListPaginated' })
    // 가비지 컬렉션 실행으로 메모리 정리
    client.cache.gc()
  }, [client])

  useEffect(() => {
    const currentUrl = `${pathname}?${searchParams.toString()}`

    if (prevUrl.current && prevUrl.current !== currentUrl) {
      clearPokemonCache()
    }

    prevUrl.current = currentUrl
  }, [pathname, searchParams, clearPokemonCache])

  useEffect(() => {
    // 브라우저 뒤로가기/앞으로가기 이벤트
    window.addEventListener('popstate', clearPokemonCache)

    return () => {
      window.removeEventListener('popstate', clearPokemonCache)
    }
  }, [clearPokemonCache])
}
