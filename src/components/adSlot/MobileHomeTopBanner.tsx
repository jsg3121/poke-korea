'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const MobileHomeTopBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="w-full h-fit mb-8 mx-auto">
      <ins
        className="adsbygoogle w-[320px] h-[100px] block mx-auto"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="4766781521"
      ></ins>
    </div>
  )
}

export default MobileHomeTopBanner
