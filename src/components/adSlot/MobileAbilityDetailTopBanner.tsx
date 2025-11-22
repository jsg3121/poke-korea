'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const MobileAbilityDetailTopBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="w-full h-fit mb-8 mx-auto">
      <ins
        className="adsbygoogle w-[320px] h-[100px] block mx-auto"
        data-ad-client="ca-pub-648162272437676"
        data-ad-slot="4679151614"
      ></ins>
    </div>
  )
}

export default MobileAbilityDetailTopBanner
