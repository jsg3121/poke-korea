'use client'

import { useState, useEffect } from 'react'

export const useQuizTimer = (startTime: Date | null) => {
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isActiveTimer, setIsActiverTimer] = useState<boolean>(true)

  const onCloseTimer = () => {
    setIsActiverTimer(false)
  }

  useEffect(() => {
    if (!startTime) {
      setTimeElapsed(0)
      return
    }

    if (!isActiveTimer) {
      return
    }

    const interval = setInterval(() => {
      const currentTime = Date.now()
      const elapsed = Math.floor((currentTime - startTime.getTime()) / 1000)
      setTimeElapsed(elapsed)
    }, 1000)

    return () => clearInterval(interval)
  }, [isActiveTimer, startTime])

  return {
    timeElapsed,
    onCloseTimer,
  }
}
