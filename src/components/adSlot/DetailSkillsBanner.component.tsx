'use client'

import { ADSENSE_CLIENT, DETAIL_INCONTENT_SLOTS } from '~/constants/adSense'
import { useAdSlotEffect } from '~/hooks/useAdSlotEffect'
import { useDevice } from '~/context/Device.context'

const DetailSkillsBanner = () => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  const slot = isMobile
    ? DETAIL_INCONTENT_SLOTS.point2Mobile
    : DETAIL_INCONTENT_SLOTS.point2Desktop

  if (!slot) {
    return null
  }

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mx-auto">
      <ins
        className={
          isMobile
            ? 'adsbygoogle w-[320px] h-[100px] block mx-auto'
            : 'adsbygoogle w-[728px] h-[90px] block mx-auto'
        }
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
      ></ins>
    </div>
  )
}

export default DetailSkillsBanner
