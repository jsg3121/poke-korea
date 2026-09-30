'use client'

import { ADSENSE_CLIENT, MOVES_DETAIL_BOTTOM_SLOTS } from '~/constants/adSense'
import { useAdSlotEffect } from '~/hooks/useAdSlotEffect'
import { useDevice } from '~/context/Device.context'

const MovesDetailBottomBanner = () => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  const slot = isMobile
    ? MOVES_DETAIL_BOTTOM_SLOTS.mobile
    : MOVES_DETAIL_BOTTOM_SLOTS.desktop

  if (!slot) {
    return null
  }

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mx-auto">
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

export default MovesDetailBottomBanner
