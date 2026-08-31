'use client'
import { ADSENSE_CLIENT, TYPE_DETAIL_SLOTS } from '~/constants/adSense'
import { useDevice } from '~/context/Device.context'
import { useAdSlotEffect } from '~/hook/useAdSlotEffect'

/**
 * 타입 상성 상세(/type-effectiveness/[type]) 인콘텐츠 광고 — 18개 타입 라우트 공용.
 *
 * ## 위치: 복합 타입 섹션 **앞**(주는 데미지 뒤)
 *
 * 섹션 경계에 두되 다음 섹션 헤딩 **위**에 붙인다. 헤딩 아래에 넣으면 제목과
 * 그 본문 사이가 광고로 갈라져 읽는 흐름이 끊긴다.
 *
 * 폴드에는 두지 않는다 — 이 페이지는 `땅타입 약점` 같은 검색 유입에 즉답하는
 * 것이 존재 이유이고, 광고가 그 자리를 밀어내면 이탈률이 올라가 순위가 떨어지고
 * 결국 트래픽 자체를 잃는다. 실측상 광고 시작점은 뷰포트와 무관하게 1,226px
 * 고정이고(콘텐츠가 반응형 단일이라 위치가 변하지 않는다), 폴드 안에는 H1·리드·
 * 약점 즉답·받는 데미지·주는 데미지가 모두 들어간다. 즉 즉답을 마친 사용자만
 * 광고를 만난다.
 *
 * ## 기기별 포맷이 다르다
 *
 * - 데스크톱: 인아티클. 같은 사이트 PC 인아티클 채움률 **88%** vs 고정 규격
 *   42%(728×90) — fluid는 광고주가 크기를 맞춰 들어올 수 있어 재고 폭이 넓다.
 *   높이는 프로덕션 8회 실측 280px 고정(편차 0)이라 가변 리스크가 없다.
 * - 모바일: 320×100 디스플레이 고정. 모바일 인아티클은 뷰포트 폭이 기기마다
 *   달라 높이가 실제로 변동해 UX 부담이 있다(1.44.0에서 같은 이유로 보류한 선례).
 *
 * 포맷이 다르면 필요한 `<ins>` 속성 자체가 달라(fluid는 data-ad-layout·
 * data-ad-format 필요) className만 바꾸지 않고 JSX를 분기한다. 미노출 유닛의
 * 숨김 렌더는 AdSense 정책 위반이라 CSS 분기 대신 조건부 렌더를 쓴다(DOM에
 * 한쪽만 삽입). 슬롯 미발급 시('') 빈 광고 요청을 막기 위해 렌더하지 않는다.
 *
 * ## 여백은 래퍼가 아니라 `<ins>`에 준다 (unfilled 대비)
 *
 * 광고가 채워지지 않으면 AdSense가 `<ins>`에 `display:none`을 건다. 이때 여백을
 * 래퍼 div의 패딩으로 두면 `<ins>`만 사라지고 패딩은 남아, 앞뒤 섹션 여백과
 * 합쳐져 빈 공간이 된다(모바일 기준 80px). 모바일 슬롯 채움률이 58~62%라 약
 * 40% 확률로 발생하는 상황이다. 마진을 `<ins>`에 직접 주면 숨겨질 때 마진도
 * 함께 사라져 앞뒤 섹션이 정상 간격(40px)으로 붙는다.
 *
 * 아래쪽 마진은 주지 않는다 — 다음 섹션이 이미 `pt-10`(PC `pt-14`)으로 자기
 * 위 여백을 갖고 있어, `mb`를 더하면 그만큼 합산돼 아래만 벌어진다(모바일 60px).
 *
 * 위 마진은 모바일 20px(`mt-5`)·PC 40px(`mt-10`)로 섹션 간 간격(40/56px)보다
 * 작게 잡았다. 광고가 앞 섹션에 가깝게 붙어 그에 딸린 것으로 읽히고, 다음
 * 섹션과는 충분히 떨어져 새 주제의 시작이 분명해진다. 위아래를 같게 맞추면
 * 광고가 독립된 섹션처럼 보여 존재감이 과해진다.
 */
const TypeDetailBanner = () => {
  const { slotRef } = useAdSlotEffect()
  const { isMobile } = useDevice()

  const slot = isMobile ? TYPE_DETAIL_SLOTS.mobile : TYPE_DETAIL_SLOTS.desktop

  if (!slot) {
    return null
  }

  return (
    <div ref={slotRef} className="mx-auto h-fit w-full max-w-[1280px]">
      {isMobile ? (
        <ins
          className="adsbygoogle mx-auto mt-5 block h-[100px] w-[320px]"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
        ></ins>
      ) : (
        <ins
          className="adsbygoogle mx-auto mt-10 block text-center"
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
        ></ins>
      )}
    </div>
  )
}

export default TypeDetailBanner
