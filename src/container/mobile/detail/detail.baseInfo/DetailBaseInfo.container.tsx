'use client'
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
    <section
      className="w-full flex flex-col gap-12 py-8 px-5 mx-auto"
      aria-label="포켓몬 상세 정보"
    >
      <DescriptionComponent />
      <AbilitiesInfoComponent />
      <TypesInfoComponent type={activeTypeInfo.types} />
      {pokemonBaseInfo.evolutionId.length > 0 && (
        <RelationPokemonComponent
          name={pokemonBaseInfo.name}
          evolutionId={pokemonBaseInfo.evolutionId}
        />
      )}
    </section>
  )
}

export default DetailBaseInfoContainer
