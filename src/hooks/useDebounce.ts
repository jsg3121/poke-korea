import { useCallback, useEffect, useRef, useState } from 'react'

type DebounceType = (str: string) => void

type UseDebounce = (initialValue?: string) => [string, DebounceType]

/**
 * text 입력값 debounce.
 * @param initialValue 초기 키워드 — URL 등 외부 상태와 맞춰 시작할 때 쓴다(기본 '')
 * @returns [마지막 문자열, debounce 함수]
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
 * 콜백을 debounce해 실행한다.
 * @param callback debounce할 콜백
 * @param delay 지연 시간(기본 500ms)
 * @returns debounce된 콜백
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
