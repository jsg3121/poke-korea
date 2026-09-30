'use client'

import { ADSENSE_CLIENT } from '~/constants/adSense'
import { useAdSlotEffect } from '~/hooks/useAdSlotEffect'
import { useDevice } from '~/context/Device.context'

const HomeBottomBanner = () => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  if (isMobile) {
    return (
      <div ref={slotRef} className="w-full px-4 mx-auto h-fit">
        <ins
          className="adsbygoogle block text-center mx-auto"
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot="3812792500"
        ></ins>
      </div>
    )
  }

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mx-auto">
      <ins
        className="adsbygoogle block w-[970px] h-[250px] mx-auto"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot="7641917377"
      ></ins>
    </div>
  )
}

export default HomeBottomBanner
