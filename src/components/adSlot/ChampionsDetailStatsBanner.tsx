'use client'
import { ADSENSE_CLIENT, CHAMPIONS_SLOTS } from '~/constants/adSense'
import { useDevice } from '~/context/Device.context'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

/**
 * 챔피언스 상세 데스크톱 좌측(능력치 박스 아래) 전용 광고 — RES-004.
 *
 * 데스크톱 2단 레이아웃에서 좌측 능력치 컬럼(w-96=384px)이 우측 메타패널보다
 * 짧아 하단에 빈 공간이 생긴다. 그 공간을 채워 콘텐츠를 밀어내지 않는다.
 *
 * 형식은 300×250(Medium Rectangle) 고정 — 좁은 사이드바 컬럼(384px)에 인아티클
 * (fluid)을 넣으면 소재 폭에 따라 컬럼을 삐져나갈 수 있어, 폭 300px 고정 사각형을
 * 쓴다(384px 안에 확실히 수용). 300×250은 디스플레이 광고 물량이 가장 많은 규격
 * 중 하나라 fill rate도 안정적이다.
 *
 * 데스크톱 전용: 모바일에선 렌더하지 않는다(모바일 상세 광고는 메타패널 뒤에 별도
 * 배치 — ChampionsInContentBanner). 슬롯 미발급('') 시 렌더하지 않는다.
 */
const ChampionsDetailStatsBanner = () => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  const slot = CHAMPIONS_SLOTS.detailDesktop

  if (isMobile || !slot) {
    return null
  }

  return (
    <div ref={slotRef} className="w-full h-fit text-center mx-auto mt-6">
      <ins
        className="adsbygoogle w-[300px] h-[250px] block mx-auto"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
      ></ins>
    </div>
  )
}

export default ChampionsDetailStatsBanner
