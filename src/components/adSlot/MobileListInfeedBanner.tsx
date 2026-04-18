'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const MobileListInfeedBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="col-span-2 w-full h-fit my-2">
      <ins
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-format="fluid"
        data-ad-layout-key="-gt-8+1c-3l+56"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="2844119940"
      ></ins>
    </div>
  )
}

export default MobileListInfeedBanner
