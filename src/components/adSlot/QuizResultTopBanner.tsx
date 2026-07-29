'use client'
import { ADSENSE_CLIENT } from '~/constants/adSense'
import { useDevice } from '~/context/Device.context'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

interface QuizResultTopBannerProps {
  /** 모바일 슬롯 ID */
  mobileSlot: string
  /** 데스크톱 슬롯 ID */
  desktopSlot: string
}

/**
 * 퀴즈 결과(RESULT) 상단 광고 — RES-004 재도입. 4종 퀴즈 결과가 슬롯만 바꿔
 * 공유하는 공통 컴포넌트(형식 동일). 결과 최상단(ResultHeader 앞).
 *
 * 검증된 기존 슬롯을 퀴즈별로 재사용한다(QUIZ_RESULT_SLOTS). 기기별로 형식이
 * 다르다: 데스크톱 가로형(w-full h-90) / 모바일(w-full h-50).
 */
const QuizResultTopBanner = ({
  mobileSlot,
  desktopSlot,
}: QuizResultTopBannerProps) => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  if (isMobile) {
    return (
      <div ref={slotRef} className="w-full h-fit mx-auto">
        <ins
          className="adsbygoogle w-full h-[50px] block mx-auto text-center"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={mobileSlot}
        ></ins>
      </div>
    )
  }

  return (
    <div ref={slotRef} className="w-full max-w-[1280px] h-fit mx-auto">
      <ins
        className="adsbygoogle w-full h-[90px] block text-center"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={desktopSlot}
      ></ins>
    </div>
  )
}

export default QuizResultTopBanner
