import isEqual from 'fast-deep-equal'
import React, { InputHTMLAttributes } from 'react'
import styled from 'styled-components'
import { Image } from '~/components'
import { PokemonTypes } from '~/types'

interface TypeFieldButtonComponentsProps
  extends InputHTMLAttributes<HTMLInputElement> {
  typeValue: string
  typeName: PokemonTypes
}

const TypeFieldButton = styled.div`
  width: 100%;
  height: 3.5rem;
  text-align: center;
  transition: transform 0.2s ease-out;
  will-change: transform;
  cursor: pointer;

  input {
    display: none;
  }

  label {
    width: 100%;
    height: 3.5rem;
    opacity: 0.7;
    display: block;
    text-align: center;

    & > .icon-type {
      width: 2rem;
      height: 2rem;
      opacity: 0.6;
      filter: grayscale(1) drop-shadow(1px 2px 0px var(--color-black-1));
      display: block;
      margin: 0 auto 0.5rem;
    }

    & > span {
      color: #000000;
    }
  }

  input:checked + label {
    opacity: 1;

    & > .icon-type {
      filter: grayscale(0) drop-shadow(1px 2px 0px var(--color-black-1));
    }

    & > span {
      font-weight: bold;
    }
  }

  input:disabled + label {
    opacity: 0.2;
  }
`

const TypeFieldButtonComponents: React.FC<TypeFieldButtonComponentsProps> = (
  props,
) => {
  const { typeName, typeValue, disabled, defaultChecked, ...restProps } = props

  return (
    <TypeFieldButton className="button__field--type">
      <input
        type="checkbox"
        id={`field-type-${typeValue}`}
        disabled={disabled}
        value={typeName}
        checked={defaultChecked}
        {...restProps}
      />
      <label htmlFor={`field-type-${typeValue}`}>
        <i className="icon-type">
          <Image
            alt={`${typeName} 타입 필터 선택`}
            height="100%"
            width="100%"
            src={`/assets/type/${typeValue}.svg`}
            loading="lazy"
          />
        </i>
        <span className="type-name">{typeName}</span>
      </label>
    </TypeFieldButton>
  )
}

export default React.memo(TypeFieldButtonComponents, isEqual)
