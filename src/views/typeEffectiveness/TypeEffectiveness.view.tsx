'use client'

import { TypeEffectivenessProvider } from '~/context/TypeEffectiveness.context'
import TypeEffectivenessTopBanner from '~/components/adSlot/TypeEffectivenessTopBanner.component'
import PageHeader from '~/components/pageHeader/PageHeader.component'
import TypeCalculator from '~/containers/typeEffectiveness/TypeCalculator.container'
import TypeCalculatorResult from '~/containers/typeEffectiveness/TypeCalculatorResult.container'
import TypeEffectivenessDescription from '~/containers/typeEffectiveness/TypeEffectivenessDescription.container'
import TypeEffectivenessTable from '~/containers/typeEffectiveness/TypeEffectivenessTable.container'
import TypeQuickLinks from '~/containers/typeEffectiveness/TypeQuickLinks.container'

const TypeEffectiveness = () => {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 pb-8">
      <PageHeader
        title="포켓몬 타입 상성표·상성 계산기"
        description="상대 포켓몬의 타입을 선택하면 약점과 주의할 타입을 바로 알려드려요. 18개 타입 전체 상성표와 타입별 약점도 함께 확인하세요."
      />

      <TypeEffectivenessProvider>
        <TypeCalculator />
        <TypeEffectivenessTopBanner />
        <TypeQuickLinks />
        <TypeCalculatorResult />
        <TypeEffectivenessTable />
      </TypeEffectivenessProvider>

      <TypeEffectivenessDescription />
    </section>
  )
}

export default TypeEffectiveness
