import { useEffect, useState } from 'react'

export const useHeaderScroll = () => {
  const [scrolling, setScrolling] = useState<boolean>(false)

  useEffect(() => {
    const handleWindowScroll = () => {
      const moveScrolling = window.scrollY > 5
      setScrolling(moveScrolling)
    }

    window.addEventListener('scroll', handleWindowScroll)

    return () => {
      window.removeEventListener('scroll', handleWindowScroll)
    }
  }, [])

  return {
    scrolling,
  }
}
