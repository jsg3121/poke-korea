import { RefObject, useEffect, useRef, useState } from 'react'

type UseHeaderScrollType = (mode?: 'desktop' | 'mobile') => {
  observerRef: RefObject<HTMLDivElement>
  isScroll: boolean
}

export const useHeaderScroll: UseHeaderScrollType = (mode = 'desktop') => {
  const [isScroll, setIsScroll] = useState<boolean>(false)
  const observerRef = useRef<HTMLDivElement>(null)
  const initialYPosRef = useRef<number | null>(null)

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
        if (intersectionRatio < 1) {
          setIsScroll(true)
        } else {
          setIsScroll(false)
        }
      }
    })
  }

  const oberverRootMargin =
    mode === 'desktop' ? '0px 0px 0px 50%' : '-20px 0px 0px 0px'

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: oberverRootMargin,
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
