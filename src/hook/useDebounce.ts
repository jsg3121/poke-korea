import { useEffect, useState } from 'react'

type DebounceType = (str: string) => void

type UseDebounce = () => [string, DebounceType]

/**
 * info : text 입력값 debounce
 * @author 장선규 jsg3121
 * @returns [마지막 문자열, debounce 함수 ]
 */
export const useDebounce: UseDebounce = () => {
  const [value, setValue] = useState<string>('')
  const [keyword, setKeyword] = useState<string>('')

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
