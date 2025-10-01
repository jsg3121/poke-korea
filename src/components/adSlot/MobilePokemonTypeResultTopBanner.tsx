'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const MobilePokemonTypeResultTopBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="w-full h-fit mx-auto">
      <ins
        className="adsbygoogle w-full h-[50px] block mx-auto text-center my-6"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="8942962819"
      ></ins>
    </div>
  )
}

export default MobilePokemonTypeResultTopBanner
