'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const DesktopTypeEffectivenessBanner = () => {
  const { slotRef } = useAdSlotEffect()
  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit">
      <ins
        className="adsbygoogle w-[970px] h-[250px] block mx-auto"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="6041965400"
      ></ins>
    </div>
  )
}

export default DesktopTypeEffectivenessBanner
