'use client'
import { ADSENSE_CLIENT } from '~/constants/adSense'
import { useDevice } from '~/context/Device.context'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

/**
 * 퀴즈 허브(/quiz) 상단 광고 — RES-004 재도입. 페이지 헤더 바로 아래.
 * 검증된 기존 슬롯을 기기별로 재사용한다:
 * - 데스크톱: 가로형(w-full h-90) 슬롯 7044940678.
 * - 모바일: 320×100 슬롯 5606353037.
 */
const QuizMainTopBanner = () => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  if (isMobile) {
    return (
      <div ref={slotRef} className="w-full h-fit mx-auto">
        <ins
          className="adsbygoogle w-[320px] h-[100px] block mx-auto text-center"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot="5606353037"
        ></ins>
      </div>
    )
  }

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mx-auto">
      <ins
        className="adsbygoogle w-full h-[90px] block text-center mx-auto"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot="7044940678"
      ></ins>
    </div>
  )
}

export default QuizMainTopBanner
