'use client'

import { useContext } from 'react'

import { getDamageTypeChipColor } from '~/utils/skill.util'
import { DetailContext } from '~/context/Detail.context'
import MoveTable, {
  MoveTableItem,
} from '~/components/moveTable/MoveTable.component'

import InfoCardTitle from './components/InfoCardTitle.component'
import {
  MoveConceptNote,
  MoveEffectDescription,
} from './components/MoveDescription.component'

const DetailSignatureMoves = () => {
  const { activeTypeInfo } = useContext(DetailContext)

  const levelUpSkills = activeTypeInfo.learnableSkills?.levelUpSkills ?? []
  const machineSkills = activeTypeInfo.learnableSkills?.machineSkills ?? []

  const seen = new Set<string>()
  const signatureMoves: Array<MoveTableItem> = []
  const descriptions: Array<{ id: string; name: string; description: string }> =
    []

  const collect = (
    skill: (typeof levelUpSkills)[number]['skill'],
    condition: string,
  ) => {
    if (!skill.signatureMoves || seen.has(skill.id)) return
    seen.add(skill.id)
    signatureMoves.push({
      condition,
      name: skill.nameKo,
      type: skill.type,
      damageClass: getDamageTypeChipColor(skill.damageType),
      power: skill.power,
      accuracy: skill.accuracy,
      pp: skill.pp,
    })
    if (skill.description) {
      descriptions.push({
        id: skill.id,
        name: skill.nameKo,
        description: skill.description,
      })
    }
  }

  levelUpSkills.forEach(({ level, skill }) =>
    collect(skill, level === 0 ? '진화' : level === 1 ? '최초' : `Lv.${level}`),
  )
  machineSkills.forEach(({ skill }) => collect(skill, '머신'))

  if (signatureMoves.length === 0) {
    return null
  }

  return (
    <section
      aria-labelledby="pokemon-signature-move"
      className="card-detail w-full"
    >
      <InfoCardTitle title="전용기" id="pokemon-signature-move" />
      <MoveTable moves={signatureMoves} ariaLabel="전용기 목록" />
      {descriptions.map((desc) => (
        <MoveEffectDescription
          key={`${desc.id}-desc`}
          name={descriptions.length > 1 ? desc.name : undefined}
          text={desc.description}
        />
      ))}
      <MoveConceptNote
        title="전용기 정보"
        text="전용기는 특정 포켓몬이나 그 진화 계열만 습득할 수 있는 고유 기술이에요. 일반적인 방법으로는 다른 포켓몬이 배울 수 없으며, 전설·환상의 포켓몬은 대부분 자신만의 전용기를 지니고 있어요."
      />
    </section>
  )
}

export default DetailSignatureMoves
