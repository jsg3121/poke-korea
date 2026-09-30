'use client'

import { ADSENSE_CLIENT } from '~/constants/adSense'
import { useAdSlotEffect } from '~/hooks/useAdSlotEffect'
import { useDevice } from '~/context/Device.context'

interface ChampionsInContentBannerProps {
  mobileSlot: string
  desktopSlot: string
}

// 숨김 렌더는 AdSense 정책 위반이라 조건부 렌더로 한쪽만 DOM에 넣는다.
// 슬롯 미발급('')이면 렌더하지 않는다 — 빈 광고 요청 방지.
const ChampionsInContentBanner = ({
  mobileSlot,
  desktopSlot,
}: ChampionsInContentBannerProps) => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  const slot = isMobile ? mobileSlot : desktopSlot

  if (!slot) {
    return null
  }

  if (isMobile) {
    return (
      <div ref={slotRef} className="w-full h-fit text-center mx-auto my-6">
        <ins
          className="adsbygoogle w-[320px] h-[100px] block mx-auto"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
        ></ins>
      </div>
    )
  }

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mx-auto my-8">
      <ins
        className="adsbygoogle block text-center mx-auto"
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
      ></ins>
    </div>
  )
}

export default ChampionsInContentBanner
