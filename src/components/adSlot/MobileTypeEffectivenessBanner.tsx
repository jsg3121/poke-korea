'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const MobileTypeEffectivenessBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="w-full h-fit mx-auto">
      <ins
        className="adsbygoogle w-full h-[90px] block mx-auto text-center"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="1180520963"
      ></ins>
    </div>
  )
}

export default MobileTypeEffectivenessBanner
