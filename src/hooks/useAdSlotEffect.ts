import { useEffect, useRef } from 'react'

export const useAdSlotEffect = () => {
  const slotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = slotRef.current
    const bannerElement = container?.querySelector<HTMLElement>('.adsbygoogle')

    if (
      typeof window === 'undefined' ||
      !container ||
      !bannerElement ||
      bannerElement.getAttribute('data-adsbygoogle-status') === 'done'
    ) {
      return
    }

    const collapseIfUnfilled = () => {
      if (bannerElement.getAttribute('data-ad-status') === 'unfilled') {
        container.style.display = 'none'
      }
    }

    const observer = new MutationObserver(collapseIfUnfilled)
    observer.observe(bannerElement, {
      attributes: true,
      attributeFilter: ['data-ad-status'],
    })

    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error('AdSense push error:', e)
    }

    collapseIfUnfilled()

    return () => {
      observer.disconnect()
    }
  }, [])

  return {
    slotRef,
  }
}
