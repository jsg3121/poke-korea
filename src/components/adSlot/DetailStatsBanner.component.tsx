'use client'

import {
  ADSENSE_CLIENT,
  DETAIL_INCONTENT_INARTICLE_SLOTS,
  DETAIL_INCONTENT_SLOTS,
} from '~/constants/adSense'
import { useAdSlotEffect } from '~/hooks/useAdSlotEffect'
import { useDevice } from '~/context/Device.context'

// 숨김 렌더는 AdSense 정책 위반이라 조건부 렌더를 쓴다. 포맷이 기기별로 달라
// (fluid는 data-ad-layout 필요) className이 아니라 JSX를 분기한다.
const DetailStatsBanner = () => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  const slot = isMobile
    ? DETAIL_INCONTENT_SLOTS.point1Mobile
    : DETAIL_INCONTENT_INARTICLE_SLOTS.point1Desktop

  if (!slot) {
    return null
  }

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mx-auto">
      {isMobile ? (
        <ins
          className="adsbygoogle w-[320px] h-[100px] block mx-auto"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
        ></ins>
      ) : (
        <ins
          className="adsbygoogle block text-center mx-auto"
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
        ></ins>
      )}
    </div>
  )
}

export default DetailStatsBanner
