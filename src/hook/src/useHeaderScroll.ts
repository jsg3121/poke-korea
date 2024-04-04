import React from 'react'

export const useHeaderScroll = () => {
  const [isScroll, setIsScroll] = React.useState(false)
  const observerRef = React.useRef<HTMLDivElement>(null)

  const observerCallback = (entries: Array<IntersectionObserverEntry>) => {
    entries.forEach((entry) => {
      setIsScroll(entry.intersectionRatio < 1)
    })
  }

  React.useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    if (observerRef.current) observer.observe(observerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  return {
    observerRef,
    isScroll,
  }
}
