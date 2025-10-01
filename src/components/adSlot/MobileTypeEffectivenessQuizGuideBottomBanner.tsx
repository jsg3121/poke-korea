'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const MobileTypeEffectivenessQuizGuideBottomBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="w-full h-fit mx-auto">
      <ins
        className="adsbygoogle w-full h-[100px] block mx-auto text-center my-6"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="9523764356"
      ></ins>
    </div>
  )
}

export default MobileTypeEffectivenessQuizGuideBottomBanner
