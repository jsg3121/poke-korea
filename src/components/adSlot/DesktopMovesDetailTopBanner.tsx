'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const DesktopMovesDetailTopBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mb-4 mx-auto">
      <ins
        className="adsbygoogle block w-[970px] h-[250px] mx-auto text-center"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="3231698726"
      ></ins>
    </div>
  )
}

export default DesktopMovesDetailTopBanner
