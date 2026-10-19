interface Window {
  adsbygoogle?: any
  gtag?: (
    command: 'event',
    eventName: string,
    params?: Record<string, string | number>,
  ) => void
}
