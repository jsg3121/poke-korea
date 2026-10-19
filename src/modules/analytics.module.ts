import { AnalyticsEventMap } from '~/types/analyticsEvent.types'

export const trackEvent = <K extends keyof AnalyticsEventMap>(
  eventName: K,
  params: AnalyticsEventMap[K],
): void => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return
  }
  window.gtag('event', eventName, params)
}
