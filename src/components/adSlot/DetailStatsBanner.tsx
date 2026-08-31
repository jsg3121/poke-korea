'use client'
import {
  ADSENSE_CLIENT,
  DETAIL_INCONTENT_INARTICLE_SLOTS,
  DETAIL_INCONTENT_SLOTS,
} from '~/constants/adSense'
import { useDevice } from '~/context/Device.context'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

/**
 * 상세 지점 1(능력치↔기본정보 사이) 광고 — RES-004 배치안.
 *
 * 기기별 성과 분리 추적을 위해 슬롯을 나눈다. 서버가 layout에서 주입한
 * isMobile(useDevice)로 한쪽만 렌더한다 — 미노출 유닛의 숨김 렌더는 AdSense
 * 정책 위반이라 CSS 분기 대신 조건부 렌더를 쓴다(DOM에 한쪽만 삽입).
 * 슬롯 미발급 시('') 빈 광고 요청을 막기 위해 렌더하지 않는다.
 *
 * **포맷이 기기별로 다르다.** 모바일은 320×100 고정, 데스크톱은 인아티클이라
 * 필요한 `<ins>` 속성 자체가 달라(fluid는 data-ad-layout·data-ad-format 필요)
 * className만 바꾸지 않고 분기해 렌더한다.
 *
 * - 모바일: 320×100 디스플레이 유지. 채움률 58%로 정상 범위이고, 인아티클은
 *   뷰포트 폭이 기기마다 달라 높이가 실제로 변동해 UX 부담이 있다.
 * - 데스크톱: 728×90 → 인아티클 전환(2026-08). 728×90은 채움률 **42%**인데
 *   같은 사이트 PC 인아티클은 **88%** — 고정 규격은 그 크기 소재가 있어야만
 *   채워지지만 fluid는 광고주가 크기를 맞춰 들어올 수 있다. 높이는 실측 280px
 *   고정(편차 0)이라 90px→280px 증가분 외의 가변 리스크는 없다.
 */
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
