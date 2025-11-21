'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const DesktopHomeBottomBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mt-8 mx-auto">
      <ins
        className="adsbygoogle block w-[970px] h-[250px] mx-auto"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="7641917377"
      ></ins>
    </div>
  )
}

export default DesktopHomeBottomBanner
