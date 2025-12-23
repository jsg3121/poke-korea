'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const MobileMovesDetailBottomBanner = () => {
  const { slotRef } = useAdSlotEffect()
  return (
    <div ref={slotRef} className="w-[calc(100%-2.5rem)] mx-auto h-fit mt-8">
      <ins
        className="adsbygoogle block text-center mx-auto"
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="4353208706"
      ></ins>
    </div>
  )
}

export default MobileMovesDetailBottomBanner
