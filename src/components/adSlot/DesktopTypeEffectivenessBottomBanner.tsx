'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const DesktopTypeEffectivenessBottomBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mx-auto">
      {/* <ins
        className="adsbygoogle w-full max-w-[1280px] block mx-auto text-center"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="4978551745"
        data-ad-format="auto"
      ></ins> */}
      <ins
        className="adsbygoogle block mx-auto max-w-[1280px] w-full"
        data-ad-format="autorelaxed"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="7565409686"
      ></ins>
    </div>
  )
}

export default DesktopTypeEffectivenessBottomBanner
