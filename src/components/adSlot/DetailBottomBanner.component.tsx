'use client'

import {
  ADSENSE_CLIENT,
  DETAIL_INCONTENT_INARTICLE_SLOTS,
} from '~/constants/adSense'
import { useAdSlotEffect } from '~/hooks/useAdSlotEffect'
import { useDevice } from '~/context/Device.context'

const DetailBottomBanner = () => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  if (isMobile) {
    return (
      <div ref={slotRef} className="w-full h-fit text-center mx-auto">
        <ins
          className="adsbygoogle w-[calc(100%-3rem)] block mx-auto text-center"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot="5619127337"
          data-ad-format="auto"
        ></ins>
      </div>
    )
  }

  return (
    <div
      ref={slotRef}
      className="w-full max-w-[1280px] h-fit mx-auto text-center"
    >
      <ins
        className="adsbygoogle block text-center mx-auto"
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={DETAIL_INCONTENT_INARTICLE_SLOTS.point3Desktop}
      ></ins>
    </div>
  )
}

export default DetailBottomBanner
