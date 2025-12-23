'use client'

import { useEffect, useRef } from 'react'

const DesktopDetailSidebarBanner = () => {
  const slotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.innerWidth < 1280) {
      return
    } else {
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
    }
  }, [])

  return (
    <div
      ref={slotRef}
      className="max-w-40 max-h-fit absolute -right-[200px] xl:static xl:right-0 max-xl:w-0 max-xl:hidden"
    >
      <ins
        className="adsbygoogle w-40 h-[600px] block ml-4"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="9075172521"
        data-ad-format="auto"
      ></ins>
    </div>
  )
}

export default DesktopDetailSidebarBanner
