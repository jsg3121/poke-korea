'use client'

import { ADSENSE_CLIENT } from '~/constants/adSense'
import { useAdSlotEffect } from '~/hooks/useAdSlotEffect'
import { useDevice } from '~/context/Device.context'

const ListTopBanner = () => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  if (isMobile) {
    return (
      <div ref={slotRef} className="w-full h-fit mx-auto">
        <ins
          className="adsbygoogle w-[320px] h-[100px] block mx-auto"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot="1410249585"
        ></ins>
      </div>
    )
  }

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mx-auto px-4">
      <ins
        className="adsbygoogle block mx-auto text-center mt-8"
        data-ad-format="fluid"
        data-ad-layout-key="-f2+6i+53-cr+51"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot="1219493182"
      ></ins>
    </div>
  )
}

export default ListTopBanner
