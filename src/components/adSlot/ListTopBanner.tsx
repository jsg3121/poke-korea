'use client'
import { ADSENSE_CLIENT } from '~/constants/adSense'
import { useDevice } from '~/context/Device.context'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

/**
 * 도감 리스트(/list) 상단 광고 — RES-004 재도입. 필터바 아래·카드 그리드 앞.
 *
 * 검증된 기존 슬롯을 기기별로 재사용한다(성과 분리, 위치가 기존 상단과 같아
 * 데이터 연속성 유지):
 * - 데스크톱: 인피드(fluid, layout-key) 슬롯 1219493182 — 카드 리스트에 자연스러운
 *   네이티브형(과거 PC 리스트 상단 인피드 $1.31).
 * - 모바일: 디스플레이 320×100 슬롯 1410249585(과거 모바일 리스트 배너 $0.94).
 *
 * 카드 사이 인피드는 재도입하지 않는다 — 구버전 카드 사이 인피드는 커버리지·CTR이
 * 붕괴했다(PC $0.08·모바일 $0.17, moves 목록과 동일 패턴).
 */
const ListTopBanner = () => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  if (isMobile) {
    return (
      <div ref={slotRef} className="w-full h-fit mx-auto">
        <ins
          className="adsbygoogle w-[320px] h-[100px] block mx-auto"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot="1410249585"
        ></ins>
      </div>
    )
  }

  return (
    // px-4 = 카드 그리드(ListGrid.container: max-w-[1280px] px-4)와 좌우 여백 정렬
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mx-auto px-4">
      <ins
        className="adsbygoogle block mx-auto text-center mt-8"
        data-ad-format="fluid"
        data-ad-layout-key="-f2+6i+53-cr+51"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot="1219493182"
      ></ins>
    </div>
  )
}

export default ListTopBanner
