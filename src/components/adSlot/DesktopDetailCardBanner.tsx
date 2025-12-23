'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const DesktopDetailCardBanner = () => {
  const { slotRef } = useAdSlotEffect()
  return (
    <div
      ref={slotRef}
      className="w-full h-fit max-w-[1280px] -my-4 col-span-full text-center"
    >
      <ins
        className="adsbygoogle w-[970px] h-[250px] block text-center my-4 mx-auto"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="5945596249"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  )
}

export default DesktopDetailCardBanner
