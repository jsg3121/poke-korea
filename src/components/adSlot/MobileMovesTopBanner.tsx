'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const MobileMovesTopBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="w-full h-fit mb-8 mx-auto">
      <ins
        className="adsbygoogle w-[320px] h-[100px] block mx-auto"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="1972830328"
      ></ins>
    </div>
  )
}

export default MobileMovesTopBanner
