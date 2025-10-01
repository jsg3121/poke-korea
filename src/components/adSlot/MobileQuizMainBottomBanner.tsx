'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const MobileQuizMainBottomBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="w-full h-fit mx-auto">
      <ins
        className="adsbygoogle w-full block mx-auto mt-8 text-center"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="8040944682"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  )
}

export default MobileQuizMainBottomBanner
