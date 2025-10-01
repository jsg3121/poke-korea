'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const DesktopQuizMainBottomBanner = () => {
  const { slotRef } = useAdSlotEffect()
  return (
    <div ref={slotRef} className="w-full h-fit max-w-[1280px] col-span-full">
      <ins
        className="adsbygoogle w-full h-[250px] block text-center my-6"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="6683630988"
      ></ins>
    </div>
  )
}

export default DesktopQuizMainBottomBanner
