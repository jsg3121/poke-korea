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

    // 광고 미매칭(unfilled) 시 컨테이너를 접어 빈 공간을 없앤다. AdSense는 게재
    // 시도 후 <ins>에 data-ad-status="filled"|"unfilled"를 붙이므로, 이를 감지해
    // unfilled면 컨테이너를 숨긴다(고정 height 슬롯의 빈 250px 방지).
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

    // push 이전에 이미 상태가 확정된 경우도 대비
    collapseIfUnfilled()

    return () => {
      observer.disconnect()
    }
  }, [])

  return {
    slotRef,
  }
}
