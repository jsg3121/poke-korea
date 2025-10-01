'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const DesktopTypeEffectivenessBottomBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mx-auto">
      <ins
        className="adsbygoogle w-full max-w-[1280px] block mx-auto"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="4978551745"
        data-ad-format="auto"
      ></ins>
    </div>
  )
}

export default DesktopTypeEffectivenessBottomBanner
