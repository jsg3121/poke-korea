'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const DesktopListTopBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mx-auto">
      <ins
        className="adsbygoogle block mx-auto text-center mt-8"
        data-ad-format="fluid"
        data-ad-layout-key="-f2+6i+53-cr+51"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="1219493182"
      ></ins>
    </div>
  )
}

export default DesktopListTopBanner
