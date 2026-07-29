'use client'
import { ADSENSE_CLIENT, DETAIL_MOVES_SLOTS } from '~/constants/adSense'
import { useDevice } from '~/context/Device.context'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

/**
 * 포켓몬 상세 습득 기술 탭(/detail/[id]/moves) 상단 광고 — RES-004 재도입.
 * 히어로(포켓몬 식별 정보) 아래·학습법(레벨업/기술머신) 탭 위.
 *
 * 상단 배치라 디스플레이(배너)를 쓴다 — 인아티클은 상단에 두면 콘텐츠처럼 보여
 * 어색하다(/moves/[id] 상단과 동일 기준). 기기별 성과 분리를 위해 PC·모바일
 * 슬롯을 나눈다:
 * - 데스크톱: 970×250. 모바일: 320×100(높이 예측 가능).
 *
 * 기술도감 상세(/moves/[id])와 다른 페이지라 전용 슬롯을 새로 발급한다.
 * px-4·max-w-7xl은 이 페이지 콘텐츠 폭 정렬. 슬롯 미발급('') 시 렌더하지 않는다.
 */
const DetailMovesTopBanner = () => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  const slot = isMobile ? DETAIL_MOVES_SLOTS.mobile : DETAIL_MOVES_SLOTS.desktop

  if (!slot) {
    return null
  }

  return (
    <div
      ref={slotRef}
      className="w-full px-4 desktop:mx-auto desktop:max-w-7xl"
    >
      <ins
        className={
          isMobile
            ? 'adsbygoogle w-[320px] h-[100px] block mx-auto'
            : 'adsbygoogle w-[970px] h-[250px] block mx-auto'
        }
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
      ></ins>
    </div>
  )
}

export default DetailMovesTopBanner
