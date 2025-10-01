'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const DesktopQuizMainTopBanner = () => {
  const { slotRef } = useAdSlotEffect()
  return (
    <div ref={slotRef} className="w-full h-fit max-w-[1280px] col-span-full">
      <ins
        className="adsbygoogle w-full h-[90px] block text-center mt-8 mx-auto"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="7044940678"
      ></ins>
    </div>
  )
}

export default DesktopQuizMainTopBanner
