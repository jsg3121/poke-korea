'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const DesktopListInfeedBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="col-span-5 w-full h-fit">
      <ins
        className="adsbygoogle block"
        data-ad-format="fluid"
        data-ad-layout-key="-gs-5+11-4p+8c"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="9239184087"
      ></ins>
    </div>
  )
}

export default DesktopListInfeedBanner
