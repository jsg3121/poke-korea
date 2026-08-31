'use client'
import {
  ADSENSE_CLIENT,
  DETAIL_INCONTENT_INARTICLE_SLOTS,
} from '~/constants/adSense'
import { useDevice } from '~/context/Device.context'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

/**
 * 상세 지점 3(진화 체인 아래, 콘텐츠 최하단) 광고 — RES-004 배치안.
 *
 * 기기별로 슬롯과 포맷을 나눈다(성과 분리 추적):
 * - 모바일: 반응형(auto) 슬롯 5619127337 — 수익 1위(CTR 2.02%). 프로덕션 실측
 *   375×375로 정상 렌더되고 채움률 62%라 그대로 둔다.
 * - 데스크톱: 인아티클 슬롯(2026-08 전환). 직전까지 반응형(auto) 5945596249를
 *   썼으나 **채움률 11%** — 요청 10.9만 건 중 89%가 unfilled였다. 데스크톱 전체
 *   폭(1248px)에 맞는 반응형 재고가 얇은 것이 원인으로, 같은 auto 포맷이라도
 *   폭이 좁은 모바일(375px)은 62%로 정상인 것과 대비된다.
 *
 * 최하단은 아래가 푸터뿐이라 높이가 콘텐츠를 밀지 않는다 — 인아티클을 쓰기에
 * 가장 안전한 지점이다. 실측상 높이는 280px 고정이고 unfilled면 0으로 접힌다.
 *
 * 모바일 하단 탭바와는 페이지 크롬의 여백으로 분리된다(호출부 책임).
 */
const DetailBottomBanner = () => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  if (isMobile) {
    return (
      <div ref={slotRef} className="w-full h-fit text-center mx-auto">
        <ins
          className="adsbygoogle w-[calc(100%-3rem)] block mx-auto text-center"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot="5619127337"
          data-ad-format="auto"
        ></ins>
      </div>
    )
  }

  return (
    <div
      ref={slotRef}
      className="w-full max-w-[1280px] h-fit mx-auto text-center"
    >
      <ins
        className="adsbygoogle block text-center mx-auto"
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={DETAIL_INCONTENT_INARTICLE_SLOTS.point3Desktop}
      ></ins>
    </div>
  )
}

export default DetailBottomBanner
