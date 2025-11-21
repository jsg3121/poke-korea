'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const DesktopAbilityListTopBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mb-8 mx-auto">
      <ins
        className="adsbygoogle block w-[728px] h-[90px] mx-auto"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="3369121137"
      ></ins>
    </div>
  )
}

export default DesktopAbilityListTopBanner
