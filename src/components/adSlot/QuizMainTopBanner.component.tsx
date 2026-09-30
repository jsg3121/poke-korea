'use client'

import { ADSENSE_CLIENT } from '~/constants/adSense'
import { useAdSlotEffect } from '~/hooks/useAdSlotEffect'
import { useDevice } from '~/context/Device.context'

const QuizMainTopBanner = () => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  if (isMobile) {
    return (
      <div ref={slotRef} className="w-full h-fit mx-auto">
        <ins
          className="adsbygoogle w-[320px] h-[100px] block mx-auto text-center"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot="5606353037"
        ></ins>
      </div>
    )
  }

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mx-auto">
      <ins
        className="adsbygoogle w-full h-[90px] block text-center mx-auto"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot="7044940678"
      ></ins>
    </div>
  )
}

export default QuizMainTopBanner
