import { useEffect, useRef, useState } from 'react'

interface UseLazyImageOptions {
  rootMargin?: string
  threshold?: number
}

export const useLazyImage = (options: UseLazyImageOptions = {}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  const { rootMargin = '200px', threshold = 0.1 } = options

  useEffect(() => {
    const element = imgRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true)
            observer.unobserve(element) // 한번 보이면 observer 해제
          }
        })
      },
      {
        rootMargin,
        threshold,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [rootMargin, threshold, isVisible])

  const handleImageLoad = () => {
    setIsLoaded(true)
  }

  const handleImageError = () => {
    setIsLoaded(false)
  }

  return {
    imgRef,
    isVisible,
    isLoaded,
    handleImageLoad,
    handleImageError,
  }
}