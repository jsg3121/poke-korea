'use client'

import { useEffect, useState } from 'react'

interface UseCountdownOptions {
  initialCount: number
  onComplete: () => void
}

export const useCountdown = ({
  initialCount,
  onComplete,
}: UseCountdownOptions) => {
  const [count, setCount] = useState(initialCount)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (count > 0) {
        const nextCount = count - 1
        setCount(nextCount)
      } else {
        onComplete()
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [count, onComplete])

  return {
    count,
  }
}
