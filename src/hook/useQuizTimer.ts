'use client'

import { useState, useEffect } from 'react'

export const useQuizTimer = (startTime: Date | null) => {
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    if (!startTime) {
      setTimeElapsed(0)
      return
    }

    const interval = setInterval(() => {
      const currentTime = Date.now()
      const elapsed = Math.floor((currentTime - startTime.getTime()) / 1000)
      setTimeElapsed(elapsed)
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  return timeElapsed
}
