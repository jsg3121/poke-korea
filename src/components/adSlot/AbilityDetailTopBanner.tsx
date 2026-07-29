'use client'
import { ADSENSE_CLIENT } from '~/constants/adSense'
import { useDevice } from '~/context/Device.context'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

/**
 * 특성별 포켓몬 상세(/ability/[id]) 상단 광고 — RES-004 재도입. 특성 설명 헤더
 * 바로 아래(카운트·포켓몬 카드 그리드 앞).
 *
 * 검증된 기존 슬롯을 기기별로 재사용한다(성과 분리):
 * - 데스크톱: 970×250 슬롯 7943609201(과거 특성상세 배너 PC).
 * - 모바일: 320×100 슬롯 4679151614(과거 특성상세 상단 배너 모바일).
 *
 * 구버전 모바일 하단 인아티클(4353208706)은 재도입하지 않는다 — moves와 공유된
 * 슬롯인 데다, 상단 배너로 위치를 통일한다(사용자 결정).
 */
const AbilityDetailTopBanner = () => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  if (isMobile) {
    return (
      <div ref={slotRef} className="w-full h-fit mb-8 mx-auto">
        <ins
          className="adsbygoogle w-[320px] h-[100px] block mx-auto"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot="4679151614"
        ></ins>
      </div>
    )
  }

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mb-8 mx-auto">
      <ins
        className="adsbygoogle block w-[970px] h-[250px] mx-auto"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot="7943609201"
      ></ins>
    </div>
  )
}

export default AbilityDetailTopBanner
