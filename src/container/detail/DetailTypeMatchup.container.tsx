'use client'

import { useContext } from 'react'
import TypeMatchupComponent from '~/components/typeMatchup/TypeMatchup.component'
import { DetailContext } from '~/context/Detail.context'
import { calculateRelationType } from '~/module/calculateRelationType'
import DetailQuizCtaComponent from './components/DetailQuizCta.component'
import InfoCardTitleComponent from './components/InfoCardTitle.component'

/**
 * 타입 상성 카드 (반응형 단일). 활성 폼의 타입으로 방어 상성을 계산해
 * TypeMatchup DS에 조립한다 — 기존 강점/약점 토글은 비교 정보를 반쪽씩 숨겨
 * 탭 회피 원칙과 모순이라 동시 노출로 개편했다(QA 라운드 6, 사용자 합의).
 */

const DetailTypeMatchupContainer = () => {
  const { activeTypeInfo } = useContext(DetailContext)

  const relationType = calculateRelationType(activeTypeInfo.types)

  return (
    <div className="flex w-full flex-col gap-5 desktop:gap-8">
      <section className="card-detail" aria-labelledby="pokemon-type-relation">
        <InfoCardTitleComponent title="타입 상성" id="pokemon-type-relation" />
        <TypeMatchupComponent
          quad={relationType.quad}
          double={relationType.double}
          half={relationType.half}
          quarter={relationType.quarter}
          zero={relationType.zero}
        />
      </section>

      {/* 상성 직후 맥락 배치 — 퀴즈 유입 확대(UX-005 §6-3) */}
      <DetailQuizCtaComponent
        title="타입 상성 퀴즈에 도전해보세요!"
        description="약점과 저항을 얼마나 알고 있나요?"
        href="/quiz/type-effectiveness"
      />
    </div>
  )
}

export default DetailTypeMatchupContainer
