'use client'
import { Fragment, useContext } from 'react'
import { TypeEffectivenessContext } from '~/context/TypeEffectiveness.context'
import { calculateRelationType } from '~/module/calculateRelationType'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import ResultListComponents from './result.list/ResultList.components'

const TypeEffectivenessResultComponent = () => {
  const { selectTypeList } = useContext(TypeEffectivenessContext)

  const { double, half, quad, quarter, zero } =
    calculateRelationType(selectTypeList)

  const isShowStrong = half.length > 0 || quarter.length > 0 || zero.length > 0
  const isShowWeak = quad.length > 0 || double.length > 0
  const selectTypeListKo = selectTypeList
    .map((type) => {
      return PokemonTypes[type]
    })
    .join(' + ')

  return (
    <Fragment>
      <section
        className="w-full h-full mt-4"
        aria-labelledby="calculate-result-type"
      >
        {selectTypeList.length > 0 && (
          <h2 className="w-full h-16 pb-8 border-b border-solid border-primary-4 text-[2rem] leading-10 font-semibold text-primary-4 block">
            {selectTypeListKo} 타입은 이렇게 상대하세요!
          </h2>
        )}
        {isShowWeak && (
          <article className="w-full h-fit py-8 px-4 bg-primary-2 rounded-2xl my-8">
            <h3
              id="calculate-result-type"
              className="w-full h-8 text-[1.75rem] leading-8 text-left text-primary-4 mb-6"
            >
              이런 타입을 쓰면 좋아요!
            </h3>
            <dl className="w-full">
              {quad.length > 0 && (
                <ResultListComponents
                  title="4배의 데미지를 줄 수 있어요."
                  dataList={quad}
                  importantPoint={1}
                />
              )}
              {double.length > 0 && (
                <ResultListComponents
                  title="2배의 데미지를 줄 수 있어요."
                  dataList={double}
                  importantPoint={2}
                />
              )}
            </dl>
          </article>
        )}
        {isShowStrong && (
          <article className="w-full h-fit py-8 px-4 bg-primary-2 rounded-2xl my-8">
            <h3
              id="calculate-result-type"
              className="w-full h-8 text-[1.75rem] leading-8 text-left text-primary-4 mb-6"
            >
              이런 타입은 조심 해야해요!
            </h3>
            <dl className="w-full">
              {half.length > 0 && (
                <ResultListComponents
                  title="0.5배의 데미지를 받아요."
                  dataList={half}
                  importantPoint={3}
                />
              )}
              {quarter.length > 0 && (
                <ResultListComponents
                  title="0.25배의 데미지를 받아요."
                  dataList={quarter}
                  importantPoint={4}
                />
              )}
              {zero.length > 0 && (
                <ResultListComponents
                  title="데미지를 받지 않아요."
                  dataList={zero}
                  importantPoint={5}
                />
              )}
            </dl>
          </article>
        )}
      </section>
    </Fragment>
  )
}

export default TypeEffectivenessResultComponent
