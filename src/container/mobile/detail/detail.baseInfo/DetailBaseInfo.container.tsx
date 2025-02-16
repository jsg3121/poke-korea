import styled from 'styled-components'
import { DetailContext } from '~/context/Detail.context'
import AbilitiesInfoComponent from './baseInfo.abilities/AbilitiesInfo.component'
import DescriptionComponent from './baseInfo.description/Description.component'
import RelationPokemonComponent from './baseinfo.relationPokemon/RelationPokemon.component'
import TypesInfoComponent from './basInfo.typesInfo/TypesInfo.component'
import { useContext } from 'react'

const DetailBaseInfoContainer = () => {
  const { pokemonBaseInfo, activeTypeInfo } = useContext(DetailContext)

  if (!pokemonBaseInfo) return <></> // TODO : 에러 페이지 및 잘못된 페이지로 처리하기

  return (
    <Section aria-label="포켓몬 상세 정보">
      <DescriptionComponent />
      <AbilitiesInfoComponent />
      <TypesInfoComponent type={activeTypeInfo.types} />
      {pokemonBaseInfo.evolutionId.length > 0 && (
        <RelationPokemonComponent
          name={pokemonBaseInfo.name}
          evolutionId={pokemonBaseInfo.evolutionId}
        />
      )}
    </Section>
  )
}

export default DetailBaseInfoContainer

const Section = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 2rem 20px;
  margin: 0 auto;
`
