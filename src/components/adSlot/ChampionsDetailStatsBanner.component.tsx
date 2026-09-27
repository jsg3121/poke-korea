'use client'

import { ADSENSE_CLIENT, CHAMPIONS_SLOTS } from '~/constants/adSense'
import { useAdSlotEffect } from '~/hooks/useAdSlotEffect'
import { useDevice } from '~/context/Device.context'

const ChampionsDetailStatsBanner = () => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  const slot = CHAMPIONS_SLOTS.detailDesktop

  if (isMobile || !slot) {
    return null
  }

  return (
    <div ref={slotRef} className="w-full h-fit text-center mx-auto mt-6">
      <ins
        className="adsbygoogle w-[300px] h-[250px] block mx-auto"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
      ></ins>
    </div>
  )
}

export default ChampionsDetailStatsBanner
