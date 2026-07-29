'use client'

import TypeEffectivenessTopBanner from '~/components/adSlot/TypeEffectivenessTopBanner'
import PageHeaderComponent from '~/components/pageHeader/PageHeader.component'
import { TypeEffectivenessProvider } from '~/context/TypeEffectiveness.context'
import TypeCalculatorContainer from '~/container/typeEffectiveness/TypeCalculator.container'
import TypeCalculatorResultContainer from '~/container/typeEffectiveness/TypeCalculatorResult.container'
import TypeEffectivenessDescriptionContainer from '~/container/typeEffectiveness/TypeEffectivenessDescription.container'
import TypeEffectivenessTableContainer from '~/container/typeEffectiveness/TypeEffectivenessTable.container'

/**
 * 타입 상성 계산기 뷰 (반응형 단일 — UX-009). 데/모 2벌
 * (TypeEffectiveness.desktop/.mobile)의 콘텐츠를 대체한다. UA 분기·
 * display:none 없이 CSS(desktop:)만으로 반응(ADR-0007).
 *
 * 섹션 순서(구버전 유지): 계산기 → [광고] → 결과 → 상성표 → 설명. PageHeader는
 * 신규 도입(구버전은 sr-only h1만 있어 시각 타이틀 부재 — ability/moves 패턴 통일).
 *
 * 광고(RES-004 재도입): 타입 선택↔결과 사이 상단 1개(구버전과 동일 위치·항상
 * 노출). 검색 유입 1위 페이지의 유일한 집중 지점이다. 구버전 하단 광고는
 * 재도입하지 않는다(도구성 페이지라 하단 도달률·수익 붕괴). 컴포넌트가 내부에서
 * useDevice로 PC 인아티클/모바일 디스플레이를 분기한다.
 *
 * Provider는 뷰 최상위로 승격 — 구버전은 계산기+결과만 감싸 상성표가 계산기
 * 선택값을 알 수 없는 구조였다. 표의 선택 열 하이라이트 연동(UX-009 §3-3)을
 * 위해 계산기·결과·표를 모두 같은 Provider 트리에 둔다. 설명은 상태와 무관한
 * 정적 섹션이라 Provider 밖이다.
 *
 * 크롬(전역 헤더/푸터/탭바) 선택은 호출부(page.tsx) 책임 — ability 뷰와 동일 패턴.
 */

const TypeEffectivenessView = () => {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 pb-8">
      <PageHeaderComponent
        title="타입 상성 계산기"
        description="상대 포켓몬의 타입을 선택하면 약점과 주의할 타입을 바로 알려드려요. 18개 타입 전체 상성표도 함께 확인하세요."
      />

      <TypeEffectivenessProvider>
        <TypeCalculatorContainer />
        {/* 타입 선택↔결과 사이 — 선택 직후 결과로 내려오는 길목(항상 노출) */}
        <TypeEffectivenessTopBanner />
        <TypeCalculatorResultContainer />
        <TypeEffectivenessTableContainer />
      </TypeEffectivenessProvider>

      <TypeEffectivenessDescriptionContainer />
    </section>
  )
}

export default TypeEffectivenessView
