'use client'

import { ADSENSE_CLIENT } from '~/constants/adSense'
import { useAdSlotEffect } from '~/hooks/useAdSlotEffect'
import { useDevice } from '~/context/Device.context'

const AbilityListTopBanner = () => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  if (isMobile) {
    return (
      <div ref={slotRef} className="w-full h-fit mb-8 mx-auto">
        <ins
          className="adsbygoogle w-[320px] h-[100px] block mx-auto"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot="5477227960"
        ></ins>
      </div>
    )
  }

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mb-8 mx-auto">
      <ins
        className="adsbygoogle block w-[970px] h-[250px] mx-auto"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot="3369121137"
      ></ins>
    </div>
  )
}

export default AbilityListTopBanner
