'use client'
import { ADSENSE_CLIENT } from '~/constants/adSense'
import { useDevice } from '~/context/Device.context'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

interface ChampionsInContentBannerProps {
  /** 모바일 슬롯 ID (빈 문자열이면 렌더 안 함) */
  mobileSlot: string
  /** 데스크톱 슬롯 ID (빈 문자열이면 렌더 안 함) */
  desktopSlot: string
}

/**
 * 챔피언스 인콘텐츠 광고 (RES-004 재배치). 4라우트(홈·도감·티어·상세)가 슬롯만
 * 바꿔 공유하는 공통 컴포넌트 — 형식이 모두 동일하기 때문(개별 컴포넌트 4벌 대신
 * 슬롯 prop 주입). 기기별 성과 분리를 위해 useDevice(서버 주입 isMobile)로
 * PC·모바일 슬롯을 나눠 조건부 렌더한다(숨김 렌더는 AdSense 정책 위반).
 *
 * 형식(위치 확인 후 확정 예정, 현재 기본안):
 * - 데스크톱: 인아티클(fluid, in-article) — 기존 champions PC 형식.
 * - 모바일: 디스플레이 320×100 — 기존 champions 모바일 형식(높이 예측 가능).
 *
 * 슬롯 미발급('') 시 렌더하지 않는다(빈 광고 요청 방지).
 */
const ChampionsInContentBanner = ({
  mobileSlot,
  desktopSlot,
}: ChampionsInContentBannerProps) => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  const slot = isMobile ? mobileSlot : desktopSlot

  if (!slot) {
    return null
  }

  if (isMobile) {
    return (
      <div ref={slotRef} className="w-full h-fit text-center mx-auto my-6">
        <ins
          className="adsbygoogle w-[320px] h-[100px] block mx-auto"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
        ></ins>
      </div>
    )
  }

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mx-auto my-8">
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

export default ChampionsInContentBanner
