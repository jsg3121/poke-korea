'use client'

import { ADSENSE_CLIENT, TYPE_DETAIL_SLOTS } from '~/constants/adSense'
import { useAdSlotEffect } from '~/hooks/useAdSlotEffect'
import { useDevice } from '~/context/Device.context'

// 포맷별로 필요한 <ins> 속성이 달라(fluid는 data-ad-layout 필요) JSX를 분기한다.
// 미노출 유닛의 숨김 렌더는 AdSense 정책 위반이라 CSS가 아닌 조건부 렌더를 쓴다.
const TypeDetailBanner = () => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  const slot = isMobile ? TYPE_DETAIL_SLOTS.mobile : TYPE_DETAIL_SLOTS.desktop

  if (!slot) {
    return null
  }

  return (
    <div ref={slotRef} className="mx-auto h-fit w-full max-w-[1280px]">
      {isMobile ? (
        <ins
          className="adsbygoogle mx-auto mt-5 block h-[100px] w-[320px]"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
        ></ins>
      ) : (
        <ins
          className="adsbygoogle mx-auto mt-10 block text-center"
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
        ></ins>
      )}
    </div>
  )
}

export default TypeDetailBanner
