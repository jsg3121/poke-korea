import { useEffect, useRef } from 'react'

export const useAdSlotEffect = () => {
  const slotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bannerElement =
      slotRef.current?.querySelector<HTMLDivElement>('.adsbygoogle')

    if (
      typeof window !== 'undefined' &&
      bannerElement &&
      bannerElement.getAttribute('data-adsbygoogle-status') !== 'done'
    ) {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (e) {
        console.error('AdSense push error:', e)
      }
    }
  }, [])

  return {
    slotRef,
  }
}
