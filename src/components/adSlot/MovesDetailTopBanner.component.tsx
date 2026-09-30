'use client'

import { ADSENSE_CLIENT, MOVES_DETAIL_TOP_SLOTS } from '~/constants/adSense'
import { useAdSlotEffect } from '~/hooks/useAdSlotEffect'
import { useDevice } from '~/context/Device.context'

const MovesDetailTopBanner = () => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  const slot = isMobile
    ? MOVES_DETAIL_TOP_SLOTS.mobile
    : MOVES_DETAIL_TOP_SLOTS.desktop

  if (!slot) {
    return null
  }

  if (isMobile) {
    return (
      <div ref={slotRef} className="w-full h-fit mx-auto">
        <ins
          className="adsbygoogle w-[320px] h-[100px] block mx-auto"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
        ></ins>
      </div>
    )
  }

  return (
    <div ref={slotRef} className="w-full h-fit mx-auto">
      <ins
        className="adsbygoogle w-[970px] h-[250px] block mx-auto"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
      ></ins>
    </div>
  )
}

export default MovesDetailTopBanner
