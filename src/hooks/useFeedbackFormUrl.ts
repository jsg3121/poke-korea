'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

import { buildFeedbackFormUrl } from '~/constants/feedbackForm'

/**
 * 현재 페이지 주소를 사전 입력한 기능/오류 신고 폼 URL.
 * @returns 신고 폼 URL
 */
export const useFeedbackFormUrl = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [formUrl, setFormUrl] = useState<string>(() => buildFeedbackFormUrl())

  useEffect(() => {
    setFormUrl(buildFeedbackFormUrl(window.location.href))
  }, [pathname, searchParams])

  return formUrl
}
