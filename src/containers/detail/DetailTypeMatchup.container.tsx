'use client'

import { useContext } from 'react'

import { calculateRelationType } from '~/modules/calculateRelationType.module'
import { DetailContext } from '~/context/Detail.context'
import TypeMatchup from '~/components/typeMatchup/TypeMatchup.component'

import DetailQuizCta from './components/DetailQuizCta.component'
import InfoCardTitle from './components/InfoCardTitle.component'

const DetailTypeMatchup = () => {
  const { activeTypeInfo } = useContext(DetailContext)

  const relationType = calculateRelationType(activeTypeInfo.types)

  return (
    <div className="flex w-full flex-col gap-5 desktop:gap-8">
      <section className="card-detail" aria-labelledby="pokemon-type-relation">
        <InfoCardTitle title="타입 상성" id="pokemon-type-relation" />
        <TypeMatchup
          quad={relationType.quad}
          double={relationType.double}
          half={relationType.half}
          quarter={relationType.quarter}
          zero={relationType.zero}
        />
      </section>

      <DetailQuizCta
        title="타입 상성 퀴즈에 도전해보세요!"
        description="약점과 저항을 얼마나 알고 있나요?"
        href="/quiz/type-effectiveness"
      />
    </div>
  )
}

export default DetailTypeMatchup
