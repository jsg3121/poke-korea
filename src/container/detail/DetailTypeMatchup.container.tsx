'use client'

import { useContext, useState } from 'react'
import { DetailContext } from '~/context/Detail.context'
import { calculateRelationType } from '~/module/calculateRelationType'
import DetailQuizCtaComponent from './components/DetailQuizCta.component'
import InfoCardTitleComponent from './components/InfoCardTitle.component'
import TypeListComponent from './components/TypeList.component'

/**
 * 타입 상성 카드 (반응형 단일 — 기존 데/모 TypesInfo·InfoContent 이관).
 * 강점/약점 토글 + 배율 그룹 나열(제목에 배율 텍스트 병기) 구조는 기존이 우수해
 * 그대로 유지한다(UX-005 §3 — "재사용 가능 구조로 확인"). 활성 폼의 타입 기준.
 */

const DetailTypeMatchupContainer = () => {
  const { activeTypeInfo } = useContext(DetailContext)
  const [activeTab, setActiveTab] = useState<'strong' | 'weak'>('strong')

  const relationType = calculateRelationType(activeTypeInfo.types)

  const tabClass = (selected: boolean) =>
    `w-[calc(50%-0.5rem)] h-8 rounded-xl text-lg text-aligned-base text-center ${
      selected ? 'bg-primary-4 text-primary-1 font-bold' : 'text-primary-2'
    }`

  return (
    <div className="flex w-full flex-col gap-8">
      <section className="card-detail" aria-labelledby="pokemon-type-relation">
        <InfoCardTitleComponent title="타입 상성" id="pokemon-type-relation" />
        <div
          className="flex w-full items-center gap-4 rounded-2xl bg-primary-1 p-2"
          role="tablist"
          aria-label="상성 강점/약점 전환"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'strong'}
            className={tabClass(activeTab === 'strong')}
            onClick={() => setActiveTab('strong')}
          >
            강점
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'weak'}
            className={tabClass(activeTab === 'weak')}
            onClick={() => setActiveTab('weak')}
          >
            약점
          </button>
        </div>
        <dl className="mt-6 flex w-full flex-col gap-4">
          {activeTab === 'strong' && (
            <>
              {relationType.half.length > 0 && (
                <TypeListComponent
                  list={relationType.half}
                  title="0.5배의 데미지를 받음"
                  grade="good"
                />
              )}
              {relationType.quarter.length > 0 && (
                <TypeListComponent
                  list={relationType.quarter}
                  title="0.25배의 데미지를 받음"
                  grade="better"
                />
              )}
              {relationType.zero.length > 0 && (
                <TypeListComponent
                  list={relationType.zero}
                  title="데미지를 받지 않음"
                  grade="best"
                />
              )}
            </>
          )}
          {activeTab === 'weak' && (
            <>
              {relationType.double.length > 0 && (
                <TypeListComponent
                  list={relationType.double}
                  title="2배의 데미지를 받음"
                  grade="warning"
                />
              )}
              {relationType.quad.length > 0 && (
                <TypeListComponent
                  list={relationType.quad}
                  title="4배의 데미지를 받음"
                  grade="danger"
                />
              )}
            </>
          )}
        </dl>
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
