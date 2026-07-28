'use client'
import { ADSENSE_CLIENT } from '~/constants/adSense'
import { useDevice } from '~/context/Device.context'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

/**
 * 기술 도감 목록(/moves) 상단 광고 — RES-004 재도입.
 *
 * sticky 크롬(검색+필터) 뒤, 카드 그리드 앞. 검증된 기존 슬롯을 기기별로
 * 재사용한다(성과 분리):
 * - 데스크톱: 디스플레이 970×250 슬롯 9663884985.
 * - 모바일: 디스플레이 320×100 슬롯 1972830328.
 *
 * 목록은 인피드(카드 사이) 대신 상단 배너를 쓴다 — 구버전 인피드는 커버리지
 * 0.02~0.03, CTR 0.02%로 사실상 실패했다(RES-004 진단).
 */
const MovesListTopBanner = () => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  if (isMobile) {
    return (
      <div ref={slotRef} className="w-full h-fit mb-4 mx-auto">
        <ins
          className="adsbygoogle w-[320px] h-[100px] block mx-auto"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot="1972830328"
        ></ins>
      </div>
    )
  }

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mb-4 mx-auto">
      <ins
        className="adsbygoogle block w-[970px] h-[250px] mx-auto text-center"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot="9663884985"
      ></ins>
    </div>
  )
}

export default MovesListTopBanner
