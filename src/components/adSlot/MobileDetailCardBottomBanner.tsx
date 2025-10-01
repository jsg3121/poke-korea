'use client'

import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const MobileDetailCardBottomBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="w-full h-fit text-center mx-auto">
      <ins
        className="adsbygoogle w-[calc(100%-3rem)] block mx-auto text-center"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="5619127337"
        data-ad-format="auto"
      ></ins>
    </div>
  )
}

export default MobileDetailCardBottomBanner
