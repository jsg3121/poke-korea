import { useEffect, useRef } from 'react'

const useInfiniteScroll = (
  handleIntersect: (
    entry: IntersectionObserverEntry,
    observer: IntersectionObserver,
  ) => void,
) => {
  const target = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let observer: any

    if (target.current) {
      observer = new IntersectionObserver(
        () => handleIntersect([entry], observer),
        {
          threshold: 0.8,
        },
      )
      observer.observe(target.current)
    }
    return () => {
      observer && observer.disconnect()
    }
  }, [])

  return target
}

export default useInfiniteScroll
