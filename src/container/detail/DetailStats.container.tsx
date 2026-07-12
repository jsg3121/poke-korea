'use client'

import { useContext } from 'react'
import SectionHeadingComponent from '~/components/SectionHeading.component'
import StatBarComponent from '~/components/statBar/StatBar.component'
import { DetailContext } from '~/context/Detail.context'
import { getActiveFormInfo } from './modules/activeForm.module'

/**
 * 능력치 섹션 (반응형 단일 — UX-005 §6-1·§7). 레이더(canvas) 차트를 StatBar
 * 가로 막대로 대체 — 수치가 DOM 텍스트라 접근성 차단(C3)이 근본 해소되고,
 * 히어로와 분리된 별도 flow 영역이라 C1(폼 버튼과 카드 겹침) 재발 여지가 없다.
 * 활성 폼의 스탯(메가/리전은 폼 스탯)을 표시한다.
 */

const DetailStatsContainer = () => {
  const {
    pokemonBaseInfo,
    megaEvolutions,
    regionFormInfo,
    gigantamaxInfo,
    normalForm,
    activeType,
    activeIndex,
  } = useContext(DetailContext)

  const { stats } = getActiveFormInfo({
    pokemonBaseInfo,
    megaEvolutions,
    regionFormInfo,
    gigantamaxInfo,
    normalForm,
    activeType,
    activeIndex,
  })

  if (!stats) return null

  return (
    <section
      aria-labelledby="detail-stats-heading"
      className="w-full px-4 desktop:mx-auto desktop:max-w-7xl"
    >
      <SectionHeadingComponent id="detail-stats-heading">
        능력치
      </SectionHeadingComponent>
      <div className="card-detail mt-4">
        <StatBarComponent
          stats={[
            { label: '체력', value: stats.hp },
            { label: '공격', value: stats.attack },
            { label: '특수공격', value: stats.specialAttack },
            { label: '방어', value: stats.defense },
            { label: '특수방어', value: stats.specialDefense },
            { label: '스피드', value: stats.speed },
          ]}
        />
      </div>
    </section>
  )
}

export default DetailStatsContainer
