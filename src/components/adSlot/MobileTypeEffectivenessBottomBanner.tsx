'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const MobileTypeEffectivenessBottomBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="w-full h-fit mx-auto">
      {/* <ins
        className="adsbygoogle w-full block mx-auto text-center"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="7855711119"
        data-ad-format="auto"
      ></ins> */}
      <ins
        className="adsbygoogle block text-center mx-auto w-full"
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="1522745513"
      ></ins>
    </div>
  )
}

export default MobileTypeEffectivenessBottomBanner
