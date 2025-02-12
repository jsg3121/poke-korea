import React from 'react'
import styled from 'styled-components'
import { DetailContext } from '~/context/Detail.context'
import AbilitiesInfoComponent from './baseInfo.abilities/AbilitiesInfo.component'
import DescriptionComponent from './baseInfo.description/Description.component'
import RelationPokemonComponent from './baseinfo.relationPokemon/RelationPokemon.component'
import TypesInfoComponent from './basInfo.typesInfo/TypesInfo.component'

const DetailBaseInfoContainer: React.FC = () => {
  const { pokemonBaseInfo, activeTypeInfo } = React.useContext(DetailContext)

  if (!pokemonBaseInfo) return <></> // TODO : 에러 페이지 및 잘못된 페이지로 처리하기

  return (
    <Div>
      <DescriptionComponent />
      <AbilitiesInfoComponent />
      <TypesInfoComponent type={activeTypeInfo.types} />
      {pokemonBaseInfo.evolutionId.length > 0 && (
        <RelationPokemonComponent
          name={pokemonBaseInfo.name}
          evolutionId={pokemonBaseInfo.evolutionId}
        />
      )}
    </Div>
  )
}

export default DetailBaseInfoContainer

const Div = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 2rem 20px;
  margin: 0 auto;
`
