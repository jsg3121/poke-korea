'use client'
import { ADSENSE_CLIENT, MOVES_DETAIL_BOTTOM_SLOTS } from '~/constants/adSense'
import { useDevice } from '~/context/Device.context'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

/**
 * 기술 상세(/moves/[id]) 하단 인아티클 광고 — RES-004 재도입.
 *
 * 포켓몬 그리드를 소비한 뒤 하단. moves 최고 효율 지점(구버전 모바일 인아티클
 * CTR 1.81% — moves 유닛 중 압도적 1위, detail 하단 인사이트와 동일 패턴).
 * 기기별 성과 분리를 위해 PC·모바일 인아티클 슬롯을 나눈다(구버전 공유 슬롯
 * 4353208706은 ability와 섞였으므로 moves 전용으로 재발급 — adSense.ts 참조).
 *
 * 슬롯 미발급 시('') 렌더하지 않는다.
 */
const MovesDetailBottomBanner = () => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  const slot = isMobile
    ? MOVES_DETAIL_BOTTOM_SLOTS.mobile
    : MOVES_DETAIL_BOTTOM_SLOTS.desktop

  if (!slot) {
    return null
  }

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mx-auto">
      <ins
        className="adsbygoogle block text-center mx-auto"
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
      ></ins>
    </div>
  )
}

export default MovesDetailBottomBanner
