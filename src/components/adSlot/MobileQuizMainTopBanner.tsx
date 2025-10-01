'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const MobileQuizMainTopBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="w-full h-fit mx-auto">
      <ins
        className="adsbygoogle w-full h-[90px] block mx-auto text-center mt-8"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="5606353037"
      ></ins>
    </div>
  )
}

export default MobileQuizMainTopBanner
