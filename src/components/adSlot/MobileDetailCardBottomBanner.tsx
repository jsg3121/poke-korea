'use client'

import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const MobileDetailCardBottomBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div
      ref={slotRef}
      className="w-[calc(100%-3rem)] h-fit text-center mx-auto"
    >
      <ins
        className="adsbygoogle w-full block mx-auto text-center"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="5619127337"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  )
}

export default MobileDetailCardBottomBanner
