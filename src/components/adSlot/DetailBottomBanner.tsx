'use client'
import { ADSENSE_CLIENT } from '~/constants/adSense'
import { useDevice } from '~/context/Device.context'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

/**
 * 상세 지점 3(진화 체인 아래, 콘텐츠 최하단) 광고 — RES-004 배치안.
 *
 * 과거 최고 수익 위치. 검증된 기존 슬롯을 기기별로 재사용한다(슬롯을 나눠 기기별
 * 성과를 계속 분리 추적):
 * - 모바일: 반응형(auto) 슬롯 5619127337 — 수익 1위(CTR 2.02%).
 * - 데스크톱: 반응형(auto) 슬롯 5945596249. 구버전은 970×250 고정 클래스로
 *   반응형을 막았으나, 최하단은 아래가 푸터뿐이라 높이 가변에 따른 CLS 부담이
 *   없어 고정 클래스(w-[970px] h-[250px])와 grid 잔재(-my-4 col-span-full)를
 *   제거하고 반응형으로 통일했다.
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
        className="adsbygoogle w-full block mx-auto text-center"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot="5945596249"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  )
}

export default DetailBottomBanner
