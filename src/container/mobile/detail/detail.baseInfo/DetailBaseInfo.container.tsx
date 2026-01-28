'use client'
import { useContext } from 'react'
import { DetailContext } from '~/context/Detail.context'
import TypesInfoComponent from './basInfo.typesInfo/TypesInfo.component'
import AbilitiesInfoComponent from './baseInfo.abilities/AbilitiesInfo.component'
import DescriptionComponent from './baseInfo.description/Description.component'
import GmaxMoveInfoComponent from './baseInfo.gmaxMove/GmaxMoveInfo.component'
import LevelLearnableSkillComponent from './baseInfo.learnableSkill/LevelLearnableSkill.component'
import MachineLearnableSkillComponent from './baseInfo.learnableSkill/MachineLearnableSkill.component'
import RelationPokemonComponent from './baseinfo.relationPokemon/RelationPokemon.component'

const DetailBaseInfoContainer = () => {
  const { pokemonBaseInfo, activeTypeInfo, activeType } =
    useContext(DetailContext)

  if (!pokemonBaseInfo) return <></> // TODO : 에러 페이지 및 잘못된 페이지로 처리하기

  const isGigantamaxMode = activeType === 'gigantamax'

  return (
    <section
      className="w-full flex flex-col gap-12 py-8 px-5 mx-auto"
      aria-label="포켓몬 상세 정보"
    >
      <DescriptionComponent />
      <AbilitiesInfoComponent />
      {isGigantamaxMode ? (
        <GmaxMoveInfoComponent />
      ) : (
        <>
          <LevelLearnableSkillComponent />
          <MachineLearnableSkillComponent />
        </>
      )}
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
