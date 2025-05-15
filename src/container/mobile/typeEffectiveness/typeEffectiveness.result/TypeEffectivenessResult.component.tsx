import { Fragment, useContext } from 'react'
import styled from 'styled-components'
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
      <Section aria-labelledby="calculate-result-type">
        {selectTypeList.length > 0 && (
          <h2>{selectTypeListKo} 타입은 이렇게 상대하세요!</h2>
        )}
        {isShowWeak && (
          <article>
            <h3 id="calculate-result-type">이런 타입을 쓰면 좋아요!</h3>
            <dl>
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
          <article>
            <h3 id="calculate-result-type">이런 타입은 조심 해야해요!</h3>
            <dl>
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
      </Section>
    </Fragment>
  )
}

export default TypeEffectivenessResultComponent

const Section = styled.section`
  width: 100%;
  height: 100%;
  margin: 1rem 0 0;

  & > h2 {
    width: 100%;
    height: 3rem;
    border-bottom: 1px solid var(--color-primary-4);
    font-size: 1.375rem;
    line-height: 2.5rem;
    font-weight: 600;
    color: var(--color-primary-4);
    display: block;
    padding-bottom: 1rem;
  }

  & > article {
    width: 100%;
    height: fit-content;
    padding: 1.25rem 1rem;
    background-color: var(--color-primary-2);
    border-radius: 1rem;
    margin: 2rem 0;

    & > h3 {
      width: 100%;
      height: 2rem;
      font-size: 1.25rem;
      line-height: 2rem;
      text-align: left;
      color: var(--color-primary-4);
      margin-bottom: 1rem;
    }

    & > dl {
      width: 100%;
    }
  }
`
