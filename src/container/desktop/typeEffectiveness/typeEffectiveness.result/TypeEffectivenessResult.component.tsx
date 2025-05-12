import { Fragment, useContext } from 'react'
import styled from 'styled-components'
import { TypeEffectivenessContext } from '~/context/TypeEffectiveness.context'
import { calculateRelationType } from '~/module/calculateRelationType'
import ResultListComponents from './result.list/ResultList.components'

const TypeEffectivenessResultComponent = () => {
  const { selectTypeList } = useContext(TypeEffectivenessContext)

  const { double, half, quad, quarter, zero } =
    calculateRelationType(selectTypeList)

  const isShowStrong = half.length > 0 || quarter.length > 0 || zero.length > 0
  const isShowWeak = quad.length > 0 || double.length > 0

  return (
    <Fragment>
      <Section aria-labelledby="calculate-result-type">
        <article>
          {isShowWeak && (
            <>
              <h3 id="calculate-result-type">이런 타입을 쓰면 좋아요!</h3>
              <dl>
                {quad.length > 0 && (
                  <ResultListComponents
                    title="4배의 데미지를 줄 수 있어요."
                    dataList={quad}
                  />
                )}
                {double.length > 0 && (
                  <ResultListComponents
                    title="2배의 데미지를 줄 수 있어요."
                    dataList={double}
                  />
                )}
              </dl>
            </>
          )}
        </article>
        <article>
          {isShowStrong && (
            <>
              <h3 id="calculate-result-type">이런 타입은 조심 해야해요</h3>
              <dl>
                {half.length > 0 && (
                  <ResultListComponents
                    title="0.5배의 데미지를 받아요."
                    dataList={half}
                  />
                )}
                {quarter.length > 0 && (
                  <ResultListComponents
                    title="0.25배의 데미지를 받아요."
                    dataList={quarter}
                  />
                )}
                {zero.length > 0 && (
                  <ResultListComponents
                    title="데미지를 받지 않아요."
                    dataList={zero}
                  />
                )}
              </dl>
            </>
          )}
        </article>
      </Section>
    </Fragment>
  )
}

export default TypeEffectivenessResultComponent

const Section = styled.section`
  width: 50%;
  height: 100%;
  margin: 1rem 0 3rem;

  & > article {
    width: 100%;

    &:first-child {
      & > h3 {
        margin-top: 0;
        padding-top: 0;
        border-top: 0;
      }
    }

    & > h3 {
      width: 100%;
      height: 2rem;
      font-size: 1.5rem;
      line-height: 2rem;
      text-align: left;
      color: var(--color-primary-4);
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px solid var(--color-primary-4);
    }

    & > dl {
      width: 100%;
    }
  }
`
