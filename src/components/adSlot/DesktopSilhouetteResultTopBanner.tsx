'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const DesktopSilhouetteResultTopBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mx-auto">
      <ins
        className="adsbygoogle w-full h-[90px] block text-center my-8"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="1431304306"
      ></ins>
    </div>
  )
}

export default DesktopSilhouetteResultTopBanner
