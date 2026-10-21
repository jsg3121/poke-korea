'use client'

import { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { useDebouncedCallback } from '~/hooks/useDebounce'

/**
 * URL 쿼리 파라미터와 연결된 검색 입력값. 입력이 멈추면 URL에 반영하고, 밖에서 파라미터가 지워지면 입력값을 비운다.
 * @param paramKey 검색어를 담는 쿼리 키
 * @returns 입력값과 입력값 변경 함수
 */
export const useSearchParamInput = (paramKey: string) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const paramValue = searchParams.get(paramKey) ?? ''
  const [keyword, setKeyword] = useState(paramValue)
  const [lastWritten, setLastWritten] = useState(paramValue)

  const updateSearchParams = useDebouncedCallback(() => {
    const nextValue = keyword.trim()
    if (nextValue === lastWritten) return

    const params = new URLSearchParams(searchParams)
    if (nextValue === '') {
      params.delete(paramKey)
    } else {
      params.set(paramKey, nextValue)
    }
    const query = params.toString()
    setLastWritten(nextValue)
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  })

  if (paramValue === '' && lastWritten !== '') {
    setLastWritten('')
    setKeyword('')
  }

  const updateKeyword = (value: string) => {
    setKeyword(value)
    updateSearchParams()
  }

  return { keyword, updateKeyword }
}
