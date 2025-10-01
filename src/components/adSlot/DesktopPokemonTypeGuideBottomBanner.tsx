'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const DesktopPokemonTypeGuideBottomBanner = () => {
  const { slotRef } = useAdSlotEffect()

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mx-auto">
      <ins
        className="adsbygoogle w-full h-[250px] block text-center mt-8"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="4680284171"
      ></ins>
    </div>
  )
}

export default DesktopPokemonTypeGuideBottomBanner
