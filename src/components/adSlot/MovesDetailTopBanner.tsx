'use client'
import { ADSENSE_CLIENT, MOVES_DETAIL_TOP_SLOTS } from '~/constants/adSense'
import { useDevice } from '~/context/Device.context'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

/**
 * 기술도감 상세(/moves/[id]) 상단 광고 — RES-004. 기술 설명(히어로) 아래·버전
 * 탭바 위. 상단은 인아티클이 콘텐츠처럼 보여 어색하므로 디스플레이(배너)를 쓴다
 * (하단 인아티클은 MovesDetailBottomBanner로 별도 유지).
 *
 * 기기별 성과 분리를 위해 PC·모바일 슬롯을 나눈다:
 * - 데스크톱: 970×250. 모바일: 320×100(높이 예측 가능).
 * 슬롯 미발급('') 시 렌더하지 않는다.
 */
const MovesDetailTopBanner = () => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  const slot = isMobile
    ? MOVES_DETAIL_TOP_SLOTS.mobile
    : MOVES_DETAIL_TOP_SLOTS.desktop

  if (!slot) {
    return null
  }

  if (isMobile) {
    return (
      <div ref={slotRef} className="w-full h-fit mx-auto">
        <ins
          className="adsbygoogle w-[320px] h-[100px] block mx-auto"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
        ></ins>
      </div>
    )
  }

  return (
    <div ref={slotRef} className="w-full h-fit mx-auto">
      <ins
        className="adsbygoogle w-[970px] h-[250px] block mx-auto"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
      ></ins>
    </div>
  )
}

export default MovesDetailTopBanner
