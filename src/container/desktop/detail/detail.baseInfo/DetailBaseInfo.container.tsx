import React from 'react'
import styled from 'styled-components'
import { DetailContext } from '~/context/Detail.context'
import { Description } from './baseInfo.description'
import { Abilities } from './baseInfo.abilities'
import { RelationPokemon } from './baseinfo.relationPokemon'
import { TypesInfo } from './basInfo.typesInfo/TypesInfo.component'

const DetailBaseInfoContainer: React.FC = () => {
  const { pokemonBaseInfo, activeTypeInfo } = React.useContext(DetailContext)

  if (!pokemonBaseInfo) return <></> // TODO : 에러 페이지 및 잘못된 페이지로 처리하기

  return (
    <Div>
      <div className="grid-wrapper">
        <Description />
        {pokemonBaseInfo.evolutionId.length > 0 && (
          <RelationPokemon
            name={pokemonBaseInfo.name}
            evolutionId={pokemonBaseInfo.evolutionId}
          />
        )}
      </div>
      <Abilities />
      <TypesInfo type={activeTypeInfo.types} />
    </Div>
  )
}

export default DetailBaseInfoContainer

const Div = styled.div`
  width: 100%;
  max-width: 1280px;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 2rem 20px;
  margin: 0 auto;

  & > .grid-wrapper {
    width: 100%;
    height: 27.625rem;
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(calc(50% - 1rem), 1fr));
  }
`
