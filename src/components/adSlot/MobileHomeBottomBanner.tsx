'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const MobileHomeBottomBanner = () => {
  const { slotRef } = useAdSlotEffect()
  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit">
      <ins
        className="adsbygoogle block text-center mx-auto"
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="3812792500"
      ></ins>
    </div>
  )
}

export default MobileHomeBottomBanner
