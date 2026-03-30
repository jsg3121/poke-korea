'use client'

import { useContext } from 'react'
import DesktopDetailCardBanner from '~/components/adSlot/DesktopDetailCardBanner'
import { DetailContext } from '~/context/Detail.context'
import { TypesInfo } from './basInfo.typesInfo/TypesInfo.component'
import AbilitiesInfoComponent from './baseInfo.abilities/AbilitiesInfo.component'
import DescriptionComponent from './baseInfo.description/Description.component'
import GmaxMoveInfoComponent from './baseInfo.gmaxMove/GmaxMoveInfo.component'
import LevelLearnableSkillComponent from './baseInfo.learnableSkill/LevelLearnableSkill.component'
import MachineLearnableSkillComponent from './baseInfo.learnableSkill/MachineLearnableSkill.component'
import ZMoveInfoComponent from './baseInfo.zMove/ZMoveInfo.component'
import RelationPokemonComponent from './baseinfo.relationPokemon/RelationPokemon.component'

const DetailBaseInfoContainer = () => {
  const { pokemonBaseInfo, activeTypeInfo, activeType } =
    useContext(DetailContext)

  if (!pokemonBaseInfo) return <></> // TODO : 에러 페이지 및 잘못된 페이지로 처리하기

  const isGigantamaxMode = activeType === 'gigantamax'

  return (
    <section
      className="w-full max-w-[1280px] grid gap-8 grid-cols-[repeat(auto-fit,minmax(calc(50%-1rem),1fr))] mx-auto "
      aria-label="포켓몬 상세 정보"
    >
      {isGigantamaxMode && <GmaxMoveInfoComponent />}
      <DescriptionComponent />
      <AbilitiesInfoComponent />
      <DesktopDetailCardBanner />
      {!isGigantamaxMode && (
        <>
          <ZMoveInfoComponent />
          <LevelLearnableSkillComponent />
          <MachineLearnableSkillComponent />
        </>
      )}
      <TypesInfo type={activeTypeInfo.types} />
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
