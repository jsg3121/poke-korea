'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const DesktopListTopBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mt-8 mx-auto">
      {/* <ins
        className="adsbygoogle w-[728px] h-[90px] block mx-auto text-center"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="9835534510"
      ></ins> */}
      <ins
        className="adsbygoogle block mx-auto text-center"
        data-ad-format="fluid"
        data-ad-layout-key="-f2+6i+53-cr+51"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="1219493182"
      ></ins>
    </div>
  )
}

export default DesktopListTopBanner
