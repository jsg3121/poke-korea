'use client'

import { PokemonTypes } from '~/types/pokemonTypes.types'
import { calculateRelationType } from '~/modules/calculateRelationType.module'
import { useTypeEffectiveness } from '~/context/TypeEffectiveness.context'
import TypeResultSection, {
  TypeResultRow,
} from '~/components/typeEffectiveness/TypeResultSection.component'

import { RESULT_TITLE_ID } from './shared/resultTitle.constants'
import TypeEffectivenessCta from './TypeEffectivenessCta.container'

const TypeCalculatorResult = () => {
  const { selectTypeList } = useTypeEffectiveness()

  const { double, half, quad, quarter, zero } =
    calculateRelationType(selectTypeList)

  const hasSelection = selectTypeList.length > 0
  const selectTypeListKo = selectTypeList
    .map((type) => PokemonTypes[type])
    .join(' + ')

  const recommendRows: Array<TypeResultRow> = [
    {
      description: '4배의 데미지를 줄 수 있어요',
      textClass: 'text-grade-danger',
      borderClass: 'border-grade-danger',
      types: quad,
    },
    {
      description: '2배의 데미지를 줄 수 있어요',
      textClass: 'text-grade-warning',
      borderClass: 'border-grade-warning',
      types: double,
    },
  ]
  const cautionRows: Array<TypeResultRow> = [
    {
      description: '0.5배의 데미지만 줄 수 있어요',
      textClass: 'text-grade-good',
      borderClass: 'border-grade-good',
      types: half,
    },
    {
      description: '0.25배의 데미지만 줄 수 있어요',
      textClass: 'text-grade-better',
      borderClass: 'border-grade-better',
      types: quarter,
    },
    {
      description: '데미지를 줄 수 없어요',
      textClass: 'text-grade-best',
      borderClass: 'border-grade-best',
      types: zero,
    },
  ]

  return (
    <div className="w-full">
      <p aria-live="polite" className="sr-only">
        {hasSelection
          ? `${selectTypeListKo} 타입 상성 결과가 표시되었습니다`
          : ''}
      </p>
      {hasSelection && (
        <section className="w-full pt-6 desktop:pt-8">
          <h2
            id={RESULT_TITLE_ID}
            className="scroll-mt-16 text-xl desktop:scroll-mt-32 desktop:text-3xl font-semibold text-primary-4 leading-tight"
          >
            {selectTypeListKo} 타입은 이렇게 상대하세요!
          </h2>
          <p className="mt-2 text-base text-primary-4/80">
            타입을 누르면 해당 타입 포켓몬을 도감에서 볼 수 있어요.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 desktop:grid-cols-2 desktop:gap-8">
            <TypeResultSection
              title="이런 타입을 쓰면 좋아요!"
              rows={recommendRows}
            />
            <TypeResultSection
              title="이런 타입은 조심해야 해요!"
              rows={cautionRows}
            />
          </div>

          <TypeEffectivenessCta />
        </section>
      )}
    </div>
  )
}

export default TypeCalculatorResult
