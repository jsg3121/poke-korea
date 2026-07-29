'use client'
import { ADSENSE_CLIENT, DETAIL_INCONTENT_SLOTS } from '~/constants/adSense'
import { useDevice } from '~/context/Device.context'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

/**
 * 상세 지점 1(능력치↔기본정보 사이) 광고 — RES-004 배치안.
 *
 * 기기별 성과 분리 추적을 위해 모바일(320×100)·데스크톱(728×90) 슬롯을 나눈다.
 * 서버가 layout에서 주입한 isMobile(useDevice)로 한쪽만 렌더한다 — 미노출 유닛의
 * 숨김 렌더는 AdSense 정책 위반이라 CSS 분기 대신 조건부 렌더를 쓴다(DOM에 한쪽만
 * 삽입). 슬롯 미발급 시('') 빈 광고 요청을 막기 위해 렌더하지 않는다.
 */
const DetailStatsBanner = () => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  const slot = isMobile
    ? DETAIL_INCONTENT_SLOTS.point1Mobile
    : DETAIL_INCONTENT_SLOTS.point1Desktop

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

export default DetailStatsBanner
