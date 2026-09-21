'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

import { buildFeedbackFormUrl } from '~/constants/feedbackForm'

/**
 * info : 현재 페이지 주소를 사전 입력한 기능/오류 신고 폼 URL
 * @author 장선규 jsg3121
 * @returns 신고 폼 URL
 *
 * SSR에는 window가 없어 첫 렌더는 사전 입력 없는 URL을 돌려준다. 마운트 후
 * 실제 주소로 교체하므로 하이드레이션 불일치가 생기지 않는다.
 *
 * pathname과 searchParams를 모두 구독하는 이유는 클라이언트 라우팅 때문이다.
 * /list의 `?name=`처럼 쿼리만 바뀌는 이동은 pathname이 그대로라, 이것만으로는
 * 직전 페이지 주소가 남는다.
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
