import styled from 'styled-components'
import ImageComponent from '~/components/Image.component'
import { PokemonType } from '~/graphql/typeGenerated'
import { CardColor, PokemonTypes } from '~/types/pokemonTypes.types'

interface TypeResultChipComponentsProps {
  typeLabel: PokemonTypes
  typeValue: PokemonType
}

const TypeResultChipComponents = ({
  typeLabel,
  typeValue,
}: TypeResultChipComponentsProps) => {
  return (
    <Span
      style={{
        backgroundColor: CardColor[typeValue],
      }}
    >
      <i className="icon-type">
        <ImageComponent
          alt={`${typeLabel} 타입 필터 선택`}
          height="1.5rem"
          width="1.5rem"
          src={`/assets/type/${typeValue.toLowerCase()}.svg`}
        />
      </i>
      {typeLabel}
    </Span>
  )
}

export default TypeResultChipComponents

const Span = styled.span`
  min-width: 4rem;
  height: 2.5rem;
  border-radius: 1rem;
  font-size: 1rem;
  line-height: calc(1.5rem + 2px);
  text-align: center;
  text-shadow: 1px 1px 1px var(--color-primary-3);
  box-shadow: 1px 2px 6px 0 var(--color-primary-1);
  display: flex;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem 0.5rem 0.5rem;

  & > i {
    width: 1.5rem;
    height: 1.5rem;
    display: block;
    filter: drop-shadow(1px 1px 1px var(--color-primary-2));
  }
`
