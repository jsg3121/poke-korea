'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const MobileMovesDetailTopBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="w-full h-fit mb-4 mx-auto">
      <ins
        className="adsbygoogle w-[320px] h-[100px] block mx-auto"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="7055393661"
      ></ins>
    </div>
  )
}

export default MobileMovesDetailTopBanner
