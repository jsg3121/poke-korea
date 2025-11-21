'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const DesktopAbilityDetailTopBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mb-8 mx-auto">
      <ins
        className="adsbygoogle block w-[970px] h-[250px] mx-auto"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="7943609201"
      ></ins>
    </div>
  )
}

export default DesktopAbilityDetailTopBanner
