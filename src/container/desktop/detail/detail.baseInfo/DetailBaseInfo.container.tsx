import styled from 'styled-components'
import { DetailContext } from '~/context/Detail.context'
import { TypesInfo } from './basInfo.typesInfo/TypesInfo.component'
import DescriptionComponent from './baseInfo.description/Description.component'
import RelationPokemonComponent from './baseinfo.relationPokemon/RelationPokemon.component'
import AbilitiesInfoComponent from './baseInfo.abilities/AbilitiesInfo.component'
import { useContext } from 'react'
import DesktopDetailRightBanner from '~/components/adSlot/DesktopDetailRightBanner'

const DetailBaseInfoContainer = () => {
  const { pokemonBaseInfo, activeTypeInfo } = useContext(DetailContext)

  if (!pokemonBaseInfo) return <></> // TODO : 에러 페이지 및 잘못된 페이지로 처리하기

  return (
    <Section aria-label="포켓몬 상세 정보">
      <div className="grid-wrapper">
        <DescriptionComponent />
        {pokemonBaseInfo.evolutionId.length > 0 && (
          <RelationPokemonComponent
            name={pokemonBaseInfo.name}
            evolutionId={pokemonBaseInfo.evolutionId}
          />
        )}
      </div>
      <DesktopDetailRightBanner />
      <AbilitiesInfoComponent />
      <TypesInfo type={activeTypeInfo.types} />
    </Section>
  )
}

export default DetailBaseInfoContainer

const Section = styled.section`
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
