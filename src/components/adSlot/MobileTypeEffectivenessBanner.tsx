'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const MobileTypeEffectivenessBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="w-full h-fit mx-auto">
      {/* <ins
        className="adsbygoogle w-[320px] h-[100px] block mx-auto"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="1180520963"
      ></ins> */}
      <ins
        className="adsbygoogle block"
        data-ad-format="fluid"
        data-ad-layout-key="-fu+52+56-cp+49"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="2341482094"
      ></ins>
    </div>
  )
}

export default MobileTypeEffectivenessBanner
