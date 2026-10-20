import { AnalyticsEventMap } from '~/types/analyticsEvent.types'

/**
 * 정의된 GA4 커스텀 이벤트를 보낸다. gtag가 없으면(개발 환경, 스크립트 로드 전, 서버) 아무것도 하지 않는다.
 * @param eventName 이벤트 이름(`AnalyticsEventMap`의 키)
 * @param params 그 이벤트의 파라미터
 */
export const trackEvent = <K extends keyof AnalyticsEventMap>(
  eventName: K,
  params: AnalyticsEventMap[K],
): void => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return
  }
  window.gtag('event', eventName, params)
}
