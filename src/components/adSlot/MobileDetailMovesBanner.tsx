'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const MobileDetailMovesBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div
      ref={slotRef}
      className="w-[calc(100%-3rem)] h-fit text-center mx-auto"
    >
      <ins
        className="adsbygoogle w-[300px] h-[250px] block text-center mx-auto"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="3916466104"
      ></ins>
    </div>
  )
}

export default MobileDetailMovesBanner
