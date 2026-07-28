'use client'
import { ADSENSE_CLIENT, DETAIL_INCONTENT_SLOTS } from '~/constants/adSense'
import { useDevice } from '~/context/Device.context'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

/**
 * 상세 지점 2(습득 기술 표↔타입 상성 사이) 광고 — RES-004 배치안.
 *
 * 기기별 성과 분리 추적을 위해 모바일(320×100)·데스크톱(728×90) 슬롯을 나눈다.
 * 분기·정책 근거는 DetailStatsBanner와 동일. 슬롯 미발급 시('') 렌더하지 않는다.
 */
const DetailSkillsBanner = () => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  const slot = isMobile
    ? DETAIL_INCONTENT_SLOTS.point2Mobile
    : DETAIL_INCONTENT_SLOTS.point2Desktop

  if (!slot) {
    return null
  }

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mx-auto">
      <ins
        className={
          isMobile
            ? 'adsbygoogle w-[320px] h-[100px] block mx-auto'
            : 'adsbygoogle w-[728px] h-[90px] block mx-auto'
        }
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
      ></ins>
    </div>
  )
}

export default DetailSkillsBanner
