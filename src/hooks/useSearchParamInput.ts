'use client'

import { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { useDebouncedCallback } from '~/hooks/useDebounce'

/**
 * URL 쿼리 파라미터와 연결된 검색 입력값. 입력이 멈추면 URL에 반영하고(비우면 즉시), 밖에서 파라미터가 지워지면 입력값을 비운다.
 * @param paramKey 검색어를 담는 쿼리 키
 * @returns 입력값과 입력값 변경 함수
 */
export const useSearchParamInput = (paramKey: string) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const paramValue = searchParams.get(paramKey) ?? ''
  const [keyword, setKeyword] = useState(paramValue)
  const [prevParamValue, setPrevParamValue] = useState(paramValue)

  const replaceSearchParams = (value: string) => {
    const nextValue = value.trim()
    if (nextValue === paramValue) return

    const params = new URLSearchParams(searchParams)
    if (nextValue === '') {
      params.delete(paramKey)
    } else {
      params.set(paramKey, nextValue)
    }
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const replaceSearchParamsDebounced = useDebouncedCallback(() => {
    replaceSearchParams(keyword)
  })

  if (paramValue !== prevParamValue) {
    setPrevParamValue(paramValue)
    if (paramValue === '') {
      setKeyword('')
    }
  }

  const updateKeyword = (value: string) => {
    setKeyword(value)
    if (value.trim() === '') {
      replaceSearchParams('')
    } else {
      replaceSearchParamsDebounced()
    }
  }

  return { keyword, updateKeyword }
}
