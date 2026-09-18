import { useCallback, useEffect, useRef, useState } from 'react'

type DebounceType = (str: string) => void

type UseDebounce = (initialValue?: string) => [string, DebounceType]

/**
 * info : text 입력값 debounce
 * @author 장선규 jsg3121
 * @param initialValue 초기 키워드 — URL 등 외부 상태와 동기화된 값으로 시작해야
 *   할 때 사용(기본 ''). value·keyword 둘 다 초기화해야 마운트 500ms 후
 *   keyword가 ''로 덮이지 않는다
 * @returns [마지막 문자열, debounce 함수 ]
 */
export const useDebounce: UseDebounce = (initialValue = '') => {
  const [value, setValue] = useState<string>(initialValue)
  const [keyword, setKeyword] = useState<string>(initialValue)

  const debounce: DebounceType = (str) => {
    setValue(str)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      return setKeyword(value)
    }, 500)
    return () => clearTimeout(timeout)
  }, [value])

  return [keyword, debounce]
}

type DebouncedCallback<T extends unknown[]> = (...args: T) => void

/**
 * info : 콜백 함수를 debounce하여 실행
 * @author 장선규 jsg3121
 * @param callback debounce할 콜백 함수
 * @param delay debounce 지연 시간 (기본값: 500ms)
 * @returns debounce된 콜백 함수
 */
export const useDebouncedCallback = <T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number = 500,
): DebouncedCallback<T> => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const callbackRef = useRef(callback)

  callbackRef.current = callback

  const debouncedCallback = useCallback(
    (...args: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    },
    [delay],
  )

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return debouncedCallback
}
