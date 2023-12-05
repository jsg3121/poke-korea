import React, { MouseEventHandler } from 'react'
import isEqual from 'fast-deep-equal'
import styled from 'styled-components'
import { PokemonTypes } from '~/types'
import { Image } from '~/components'

interface TypeFieldButtonComponentsProps {
  onClick: (value: string) => void
  typeValue: string
  typeName: PokemonTypes
  disabled?: boolean
}

const TypeFieldButton = styled.div`
  width: 2rem;
  text-align: center;
  transition: transform 0.2s ease-out;
  will-change: transform;
  cursor: pointer;

  input {
    display: none;
  }

  label {
    width: 2rem;
    opacity: 0.6;
    filter: grayscale(1);
    display: block;
  }

  input:checked + label {
    opacity: 1;
    filter: grayscale(0);
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
`

const TypeFieldButtonComponents: React.FC<TypeFieldButtonComponentsProps> = (
  props
) => {
  const { onClick, typeName, typeValue, disabled } = props

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      onClick(e.currentTarget.value)
    },
    [onClick]
  )

  return (
    <TypeFieldButton className="button__field--type">
      <input
        type="checkbox"
        id={`field-type-${typeValue}`}
        disabled={disabled}
        onClick={handleClick}
        value={typeName}
      />
      <label htmlFor={`field-type-${typeValue}`}>
        <Image
          alt={`${typeName} 타입 필터 선택`}
          height="2rem"
          width="2rem"
          src={`/assets/type/${typeValue}.svg`}
          loading="lazy"
        />
      </label>
      <span className="field__tooltip">{typeName}</span>
    </TypeFieldButton>
  )
}

export default React.memo(TypeFieldButtonComponents, isEqual)
