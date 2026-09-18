import { Fragment } from 'react'

import {
  TYPE_EFFECTIVENESS_ITEMLIST_JSON_LD,
  TYPE_EFFECTIVENESS_WEBPAGE_JSON_LD,
} from '~/constants/typeEffectivenessJsonLd'
import TypeEffectiveness from '~/views/typeEffectiveness/TypeEffectiveness.view'

import { TYPE_EFFECTIVENESS_META } from './_metadata/typeEffectivenessMetadata'

// 이 페이지는 동적 렌더다: headers() UA 감지(크롬 선택)가 매 요청 평가된다.
// 기존 revalidate=1년 선언은 headers() 때문에 실효가 없던 거짓 신호라 제거
// (UX-009 M1, ability·list·moves와 동일). ISR 재도입은 크롬 통합 이후 검토.

export const metadata = TYPE_EFFECTIVENESS_META

const TypeEffectivenessPage = async () => {
  return (
    <Fragment>
      {/* 콘텐츠는 반응형 단일(TypeEffectiveness, ADR-0007). UA 분기는 전역
          크롬(헤더/푸터/탭바) 선택으로만 남는다(list·ability·moves와 동일 패턴). */}
      <TypeEffectiveness />
      <script
        id="type-effectiveness-webpage-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(TYPE_EFFECTIVENESS_WEBPAGE_JSON_LD),
        }}
      />
      <script
        id="type-effectiveness-itemlist-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(TYPE_EFFECTIVENESS_ITEMLIST_JSON_LD),
        }}
      />
    </Fragment>
  )
}

export default TypeEffectivenessPage
