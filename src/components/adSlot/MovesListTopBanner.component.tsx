'use client'

import { ADSENSE_CLIENT } from '~/constants/adSense'
import { useAdSlotEffect } from '~/hooks/useAdSlotEffect'
import { useDevice } from '~/context/Device.context'

const MovesListTopBanner = () => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  if (isMobile) {
    return (
      <div ref={slotRef} className="w-full h-fit mb-4 mx-auto">
        <ins
          className="adsbygoogle w-[320px] h-[100px] block mx-auto"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot="1972830328"
        ></ins>
      </div>
    )
  }

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mb-4 mx-auto">
      <ins
        className="adsbygoogle block w-[970px] h-[250px] mx-auto text-center"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot="9663884985"
      ></ins>
    </div>
  )
}

export default MovesListTopBanner
