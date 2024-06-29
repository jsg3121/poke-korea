import React from 'react'

type UseHeaderScrollType = (mode?: 'desktop' | 'mobile') => {
  observerRef: React.RefObject<HTMLDivElement>
  isScroll: boolean
}

export const useHeaderScroll: UseHeaderScrollType = (mode = 'desktop') => {
  const [isScroll, setIsScroll] = React.useState(false)
  const observerRef = React.useRef<HTMLDivElement>(null)
  const initialYPosRef = React.useRef<number | null>(null)

  const observerCallback = (entries: Array<IntersectionObserverEntry>) => {
    entries.forEach((entry) => {
      if (mode === 'desktop') {
        if (initialYPosRef.current === null) {
          initialYPosRef.current = entry.boundingClientRect.top
        }
        const currentYPos = entry.boundingClientRect.top
        if (initialYPosRef.current !== currentYPos) {
          setIsScroll(true)
        } else {
          setIsScroll(false)
        }
      } else {
        const intersectionRatio = entry.intersectionRatio
        if (intersectionRatio > 0) {
          setIsScroll(false)
        } else {
          setIsScroll(true)
        }
      }
    })
  }

  const oberverRootMargin =
    mode === 'desktop' ? '0px 0px 0px 50%' : '0px 0px 405px 0px'

  React.useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: oberverRootMargin,
      threshold: mode === 'desktop' ? 1 : 0,
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
