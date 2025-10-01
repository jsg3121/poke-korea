'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const MobileListTopBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="w-full h-fit mt-8 mx-auto">
      <ins
        className="adsbygoogle w-[calc(100%-3rem)] h-[100px] block mx-auto text-center"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="1410249585"
      ></ins>
    </div>
  )
}

export default MobileListTopBanner
