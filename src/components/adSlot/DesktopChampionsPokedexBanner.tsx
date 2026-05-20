'use client'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

const DesktopChampionsPokedexBanner = () => {
  const { slotRef } = useAdSlotEffect()
  return (
    <div
      ref={slotRef}
      className="w-full max-w-[1280px] h-fit mx-auto my-8 px-5 col-span-full"
    >
      <ins
        className="adsbygoogle block text-center mx-auto"
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-6481622724376761"
        data-ad-slot="6177029135"
      ></ins>
    </div>
  )
}

export default DesktopChampionsPokedexBanner
