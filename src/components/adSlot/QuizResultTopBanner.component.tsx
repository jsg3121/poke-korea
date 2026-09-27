'use client'

import { ADSENSE_CLIENT } from '~/constants/adSense'
import { useAdSlotEffect } from '~/hooks/useAdSlotEffect'
import { useDevice } from '~/context/Device.context'

interface QuizResultTopBannerProps {
  mobileSlot: string
  desktopSlot: string
}

const QuizResultTopBanner = ({
  mobileSlot,
  desktopSlot,
}: QuizResultTopBannerProps) => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  if (isMobile) {
    return (
      <div ref={slotRef} className="w-full h-fit mx-auto">
        <ins
          className="adsbygoogle w-full h-[50px] block mx-auto text-center"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={mobileSlot}
        ></ins>
      </div>
    )
  }

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mx-auto">
      <ins
        className="adsbygoogle w-full h-[90px] block text-center"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={desktopSlot}
      ></ins>
    </div>
  )
}

export default QuizResultTopBanner
