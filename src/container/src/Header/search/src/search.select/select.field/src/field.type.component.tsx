import React from 'react'
import isEqual from 'fast-deep-equal'
import { Checkbox, Image, Tag } from '~/components'
import { PokemonTypes } from '~/types'
import styled from 'styled-components'
import { ListContext } from '~/context'

interface FieldTypeComponentProps {
  filter?: Array<string>
}

const FieldTypeInput = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 1rem;
  justify-content: space-between;
  position: relative;

  .button__field--type {
    width: 3rem;
    text-align: center;
    padding: 0 0.5rem;
    transition: transform 0.2s ease-out;
    will-change: transform;
    cursor: pointer;

    input {
      display: none;
    }

    label {
      opacity: 0.6;
    }

    input:checked + label {
      opacity: 1;
    }

    input:disabled + label {
      opacity: 0.4;
    }

    .field__tooltip {
      width: 0;
      height: 0;
      overflow: hidden;
      font-size: 0.75rem;
      line-height: 1.25rem;
      text-align: center;
      color: #142129;
      background-color: #f3f6f7;
      border-radius: 0.5rem;
      position: absolute;
      left: 50%;
      top: 2.5rem;
      transform: translate(-50%, 0);
    }

    &:hover {
      transform: scale(1.4);

      label {
        opacity: 1;
      }

      .field__tooltip {
        width: 3rem;
        height: 1.25rem;
        opacity: 1;
      }
    }

    &:active {
      transform: scale(1.2);
    }
  }
`

const FieldTypeComponent: React.FC<FieldTypeComponentProps> = (props) => {
  const { filter } = props
  const { onChagneFilter } = React.useContext(ListContext)

  const handleChageFilter = React.useCallback(() => {}, [])

  return (
    <FieldTypeInput>
      {Object.entries(PokemonTypes).map((key) => {
        return (
          <div
            key={key[0]}
            onClick={handleChageFilter}
            className="button__field--type">
            <input type="checkbox" name="" id={`field-type-${key[0]}`} />
            <label htmlFor={`field-type-${key[0]}`}>
              <Image
                alt={`${key[1]} 타입 필터 선택`}
                height="2rem"
                width="2rem"
                src={`/assets/type/${key[0].toLowerCase()}.svg`}
              />
            </label>
            <span className="field__tooltip">{key[1]}</span>
          </div>
        )
      })}
    </FieldTypeInput>
  )
}

export default React.memo(FieldTypeComponent, isEqual)
