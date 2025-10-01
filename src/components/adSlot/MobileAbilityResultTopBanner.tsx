'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const MobileAbilityResultTopBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="w-full h-fit mx-auto">
      <ins
        className="adsbygoogle w-full h-[50px] block mx-auto text-center my-6"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="5230307889"
      ></ins>
    </div>
  )
}

export default MobileAbilityResultTopBanner
