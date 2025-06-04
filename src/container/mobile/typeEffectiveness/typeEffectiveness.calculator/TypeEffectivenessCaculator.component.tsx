import { MouseEvent, useContext } from 'react'
import styled from 'styled-components'
import ImageComponent from '~/components/Image.component'
import { TypeEffectivenessContext } from '~/context/TypeEffectiveness.context'
import { PokemonType } from '~/graphql/typeGenerated'
import { PokemonTypes } from '~/types/pokemonTypes.types'

const TypeEffectivenessCaculatorComponent = () => {
  const {
    isMaxSelectType,
    selectTypeList,
    handleChangeTypes,
    handleResetSelectTypes,
  } = useContext(TypeEffectivenessContext)

  const handleClickType = (e: MouseEvent<HTMLButtonElement>) => {
    const value = e.currentTarget.value as PokemonType
    handleChangeTypes(value)
  }

  const handleClickResetType = () => {
    handleResetSelectTypes()
  }

  return (
    <Section aria-labelledby="select-type-pokemon">
      <header>
        <h2 id="select-type-pokemon">상대 포켓몬 약점 찾기</h2>
        {isMaxSelectType ? (
          <strong>포켓몬 타입은 최대 2개까지 선택 가능합니다.</strong>
        ) : (
          <strong>상대하려는 포켓몬의 타입을 선택해주세요!</strong>
        )}
      </header>
      <ul className="select-type-list">
        {Object.entries(PokemonTypes).map(([types, typeName]) => {
          return (
            <li key={`pokemon-type-key-${types}`}>
              <button
                type="button"
                value={types}
                data-active={
                  selectTypeList.includes(types as PokemonType) ? 'active' : ''
                }
                disabled={
                  selectTypeList.length === 2 &&
                  selectTypeList.indexOf(types as PokemonType) < 0
                    ? true
                    : false
                }
                onClick={handleClickType}
              >
                <ImageComponent
                  alt={`${typeName} 타입 필터 선택`}
                  height="1.5rem"
                  width="1.5rem"
                  src={`/assets/type/${types.toLowerCase()}.svg`}
                />
                <p>{typeName}</p>
              </button>
            </li>
          )
        })}
        <li>
          <button
            type="button"
            className="button-type-reset"
            disabled={selectTypeList.length === 0}
            onClick={handleClickResetType}
          >
            <p>초기화</p>
          </button>
        </li>
      </ul>
    </Section>
  )
}

export default TypeEffectivenessCaculatorComponent

const Section = styled.section`
  width: 100%;
  border-bottom: 1px solid var(--color-primary-4);
  margin: 1rem 0 2rem;
  padding-bottom: 2rem;

  & > header {
    width: 100%;
    height: 6rem;

    & > h2 {
      width: 100%;
      height: 2.5rem;
      font-size: 2rem;
      line-height: 2.5rem;
      font-weight: 600;
      color: var(--color-primary-4);
      margin-bottom: 0.5rem;
    }

    & > strong {
      width: 100%;
      height: 2rem;
      display: block;
      font-size: 1.25rem;
      line-height: 2rem;
      color: var(--color-primary-4);
      margin-bottom: 1rem;
    }
  }

  & > ul {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;

    & > li {
      min-width: 4rem;
      height: 3rem;

      & > button {
        width: 100%;
        height: 3rem;
        border: 0;
        border-radius: 1rem;
        background-color: var(--color-primary-4);
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem 0.75rem 0.75rem;
        opacity: 0.6;

        &:disabled {
          filter: grayscale(1);
        }

        &[data-active='active'] {
          opacity: 1;
        }

        & > p {
          height: 2rem;
          font-size: 1rem;
          line-height: calc(2rem + 2px);
          color: #333333;
        }

        &.button-type-reset {
          text-align: center;
          padding: 0.75rem 1rem;
          opacity: 0.75;

          & > p {
            font-size: 0.875rem;
          }
        }
      }
    }
  }
`
