'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const MobileChampionsHomeBanner = () => {
  const { slotRef } = useAdSlotEffect()
  return (
    <div ref={slotRef} className="w-full h-fit text-center mx-auto my-6 px-5">
      <ins
        className="adsbygoogle w-[320px] h-[100px] block mx-auto"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="6984816567"
      ></ins>
    </div>
  )
}

export default MobileChampionsHomeBanner
