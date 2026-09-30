'use client'

import { ADSENSE_CLIENT, DETAIL_MOVES_SLOTS } from '~/constants/adSense'
import { useAdSlotEffect } from '~/hooks/useAdSlotEffect'
import { useDevice } from '~/context/Device.context'

const DetailMovesTopBanner = () => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  const slot = isMobile ? DETAIL_MOVES_SLOTS.mobile : DETAIL_MOVES_SLOTS.desktop

  if (!slot) {
    return null
  }

  return (
    <div
      ref={slotRef}
      className="w-full px-4 desktop:mx-auto desktop:max-w-7xl"
    >
      <ins
        className={
          isMobile
            ? 'adsbygoogle w-[320px] h-[100px] block mx-auto'
            : 'adsbygoogle w-[970px] h-[250px] block mx-auto'
        }
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
      ></ins>
    </div>
  )
}

export default DetailMovesTopBanner
