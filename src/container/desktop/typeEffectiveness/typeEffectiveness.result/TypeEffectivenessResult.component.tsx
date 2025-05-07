import { Fragment, useContext } from 'react'
import styled from 'styled-components'
import { TypeEffectivenessContext } from '~/context/TypeEffectiveness.context'
import { calculateRelationType } from '~/module/calculateRelationType'
import { PokemonTypes } from '~/types/pokemonTypes.types'

const TypeEffectivenessResultComponent = () => {
  const { selectTypeList } = useContext(TypeEffectivenessContext)

  const { double, half, quad, quarter, zero } =
    calculateRelationType(selectTypeList)

  return (
    <Fragment>
      <Section aria-labelledby="calculate-result-type">
        <article>
          <h3 id="calculate-result-type">이런 타입에 강해요!!</h3>
          <dl>
            {half.length > 0 && (
              <>
                <dt>0.5배</dt>
                <dd>
                  {half.map((type) => {
                    return (
                      <span key={`type-half-id-${type}`}>
                        {PokemonTypes[type]}
                      </span>
                    )
                  })}
                </dd>
              </>
            )}
            {quarter.length > 0 && (
              <>
                <dt>0.25배</dt>
                <dd>
                  {quarter.map((type) => {
                    return (
                      <span key={`type-quarter-id-${type}`}>
                        {PokemonTypes[type]}
                      </span>
                    )
                  })}
                </dd>
              </>
            )}
            {zero.length > 0 && (
              <>
                <dt>데미지를 받지 않아요</dt>
                <dd>
                  {zero.map((type) => {
                    return (
                      <span key={`type-zero-id-${type}`}>
                        {PokemonTypes[type]}
                      </span>
                    )
                  })}
                </dd>
              </>
            )}
          </dl>
        </article>
        <article>
          <h3 id="calculate-result-type">이런 타입에 약해요..</h3>
          <dl>
            {quad.length > 0 && (
              <>
                <dt>4배</dt>
                <dd>
                  {quad.map((type) => {
                    return (
                      <span key={`type-quad-id-${type}`}>
                        {PokemonTypes[type]}
                      </span>
                    )
                  })}
                </dd>
              </>
            )}
            {double.length > 0 && (
              <>
                <dt>2배</dt>
                <dd>
                  {double.map((type) => {
                    return (
                      <span key={`type-double-id-${type}`}>
                        {PokemonTypes[type]}
                      </span>
                    )
                  })}
                </dd>
              </>
            )}
          </dl>
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

      & > dt {
        width: 100%;
        height: 1.5rem;
        font-size: 1.25rem;
        line-height: 1.5rem;
        text-align: left;
        background-color: var(--color-primary-3);
      }

      & > dd {
        width: 100%;
        padding: 1rem 0;
        display: flex;
        align-items: center;
        gap: 1rem;

        & > span {
          width: fit-content;
          height: 3rem;
          font-size: 1rem;
          line-height: calc(2rem + 2px);
          background-color: var(--color-primary-4);
          padding: 0.5rem;
        }
      }
    }
  }
`
