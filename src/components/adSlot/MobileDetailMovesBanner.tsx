'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const MobileDetailMovesBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div
      ref={slotRef}
      className="w-[calc(100%-3rem)] h-[100px] text-center mx-auto"
    >
      <ins
        className="adsbygoogle w-[320px] h-[100px] block text-center mx-auto"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="3916466104"
      ></ins>
    </div>
  )
}

export default MobileDetailMovesBanner
