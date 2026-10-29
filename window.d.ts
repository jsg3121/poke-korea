interface Window {
  adsbygoogle?: Array<Record<string, unknown>>
  gtag?: (
    command: 'event',
    eventName: string,
    params?: Record<string, string | number>,
  ) => void
}
