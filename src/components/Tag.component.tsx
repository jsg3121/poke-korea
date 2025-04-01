import styled from 'styled-components'
import { PokemonType } from '~/graphql/typeGenerated'
import { PokemonTypes, TypesColor } from '~/types/pokemonTypes.types'

interface TagComponentProps {
  type: PokemonType
}

const Tag = styled.p<{ color: TypesColor }>`
  width: 3.6rem;
  height: 1.5rem;
  padding: 0 0.5rem;
  border-radius: 0.625rem;
  background-color: ${(props) => props.color};
  text-align: center;
  display: flex;
  align-items: center;

  & > span {
    width: 100%;
    height: 1.3rem;
    font-size: 0.85rem;
    text-align: center;
    line-height: calc(1.3rem + 3px);
    color: #ffffff;
    filter: drop-shadow(0px 0px 1px #000000);
    margin: 0;
  }
`

const TagComponent = ({ type }: TagComponentProps) => {
  return (
    <Tag color={TypesColor[type]}>
      <span>{PokemonTypes[type]}</span>
    </Tag>
  )
}

export default TagComponent
