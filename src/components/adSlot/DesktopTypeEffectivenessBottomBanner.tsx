'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const DesktopTypeEffectivenessBottomBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mx-auto">
      <ins
        className="adsbygoogle w-full h-[140px] block mx-auto text-center"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="4978551745"
      ></ins>
    </div>
  )
}

export default DesktopTypeEffectivenessBottomBanner
