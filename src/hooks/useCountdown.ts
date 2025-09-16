'use client'

import { useState, useEffect, useCallback } from 'react'

interface UseCountdownOptions {
  initialCount: number
  onComplete: () => void
  onTick?: (count: number) => void
}

export const useCountdown = ({
  initialCount,
  onComplete,
  onTick,
}: UseCountdownOptions) => {
  const [count, setCount] = useState(initialCount)
  const [isActive, setIsActive] = useState(false)

  const start = useCallback(() => {
    setCount(initialCount)
    setIsActive(true)
  }, [initialCount])

  const stop = useCallback(() => {
    setIsActive(false)
    setCount(initialCount)
  }, [initialCount])

  useEffect(() => {
    if (!isActive) return

    if (count > 0) {
      const timer = setTimeout(() => {
        const nextCount = count - 1
        setCount(nextCount)
        if (onTick) {
          onTick(nextCount)
        }
      }, 1000)

      return () => clearTimeout(timer)
    } else {
      setIsActive(false)
      onComplete()
    }
  }, [count, isActive, onComplete, onTick])

  return {
    count,
    isActive,
    start,
    stop,
  }
}
