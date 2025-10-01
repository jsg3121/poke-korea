'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const DesktopDetailMovesBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="w-full h-fit mx-auto">
      <ins
        className="adsbygoogle w-[970px] h-[250px] block mx-auto"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="7739612305"
      ></ins>
    </div>
  )
}

export default DesktopDetailMovesBanner
