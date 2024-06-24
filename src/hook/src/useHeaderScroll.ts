import React from 'react'

export const useHeaderScroll = () => {
  const [isScroll, setIsScroll] = React.useState(false)
  const observerRef = React.useRef<HTMLDivElement>(null)
  const initialYPosRef = React.useRef<number | null>(null)

  const observerCallback = (entries: Array<IntersectionObserverEntry>) => {
    entries.forEach((entry) => {
      if (initialYPosRef.current === null) {
        initialYPosRef.current = entry.boundingClientRect.top
      }

      const currentYPos = entry.boundingClientRect.top

      if (initialYPosRef.current !== currentYPos) {
        setIsScroll(true)
      } else {
        setIsScroll(false)
      }
    })
  }

  React.useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px 0px 50%',
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
