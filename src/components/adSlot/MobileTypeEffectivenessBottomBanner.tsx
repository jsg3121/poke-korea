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
        className="adsbygoogle block mx-auto"
        data-ad-format="fluid"
        data-ad-layout-key="-6t+ed+2i-1n-4w"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="8084284433"
      ></ins>
    </div>
  )
}

export default MobileTypeEffectivenessBottomBanner
