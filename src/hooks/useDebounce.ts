import { useEffect, useState } from 'react'

/**
 * text 입력값 debounce.
 * @param initialValue 초기 키워드 — URL 등 외부 상태와 맞춰 시작할 때 쓴다(기본 '')
 * @returns [마지막 문자열, debounce 함수]
 */
export const useDebounce = (initialValue = '') => {
  const [value, setValue] = useState(initialValue)
  const [keyword, setKeyword] = useState(initialValue)

  useEffect(() => {
    const timeout = setTimeout(() => setKeyword(value), 500)
    return () => clearTimeout(timeout)
  }, [value])

  return [keyword, setValue] as const
}
