'use client'
import { ADSENSE_CLIENT } from '~/constants/adSense'
import { useDevice } from '~/context/Device.context'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

/**
 * 상성계산기 상단 광고(타입 선택↔결과 사이) — RES-004 재도입.
 *
 * 검색 유입 1위 페이지의 유일한 집중 지점(타입 선택 직후, 결과로 내려오는 길목).
 * 타입 선택 여부와 무관하게 항상 노출한다(구버전과 동일). 검증된 기존 슬롯을
 * 기기별로 재사용한다(성과 분리 추적):
 * - 데스크톱: 인아티클(fluid) 슬롯 5817213746 — 이 페이지 최고 수익($11.21).
 * - 모바일: 디스플레이 320×100 슬롯 1180520963($6.39). 인아티클 대신 고정
 *   규격이라 모바일 높이가 예측 가능하다.
 *
 * 하단 광고는 재도입하지 않는다 — 구버전 하단 유닛은 커버리지·CTR·RPM이 모두
 * 붕괴(PC 하단 클릭 0)했다. 도구성 페이지라 표를 끝까지 스크롤해 하단까지
 * 도달하는 사용자가 거의 없기 때문(RES-004 진단).
 */
const TypeEffectivenessTopBanner = () => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  if (isMobile) {
    return (
      <div ref={slotRef} className="w-full h-fit mx-auto">
        <ins
          className="adsbygoogle w-[320px] h-[100px] block mx-auto"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot="1180520963"
        ></ins>
      </div>
    )
  }

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit">
      <ins
        className="adsbygoogle block text-center mx-auto"
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot="5817213746"
      ></ins>
    </div>
  )
}

export default TypeEffectivenessTopBanner
