'use client'
import { ADSENSE_CLIENT } from '~/constants/adSense'
import { useDevice } from '~/context/Device.context'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

/**
 * 특성 도감 목록(/ability) 상단 광고 — RES-004 재도입. 페이지 헤더 바로 아래
 * (검색·"특성이란?"·카드 그리드 앞, 기존 위치 복원).
 *
 * 검증된 기존 슬롯을 기기별로 재사용한다(성과 분리):
 * - 데스크톱: 970×250 슬롯 3369121137(과거 특성도감 상단 PC).
 * - 모바일: 320×100 슬롯 5477227960(과거 특성도감 상단 모바일).
 */
const AbilityListTopBanner = () => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  if (isMobile) {
    return (
      <div ref={slotRef} className="w-full h-fit mb-8 mx-auto">
        <ins
          className="adsbygoogle w-[320px] h-[100px] block mx-auto"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot="5477227960"
        ></ins>
      </div>
    )
  }

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mb-8 mx-auto">
      <ins
        className="adsbygoogle block w-[970px] h-[250px] mx-auto"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot="3369121137"
      ></ins>
    </div>
  )
}

export default AbilityListTopBanner
