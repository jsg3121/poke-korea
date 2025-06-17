'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const MobileDetailCardTopBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div
      ref={slotRef}
      className="w-[calc(100%-3rem)] h-fit text-center mx-auto"
    >
      <ins
        className="adsbygoogle w-full h-[90px] block text-center mt-8 mx-auto"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="2700260468"
      ></ins>
    </div>
  )
}

export default MobileDetailCardTopBanner
