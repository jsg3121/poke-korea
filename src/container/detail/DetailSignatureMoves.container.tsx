'use client'

import { useContext } from 'react'
import { ChipColor } from '~/components/chip/chipStyle'
import MoveTableComponent, {
  MoveTableItem,
} from '~/components/moveTable/MoveTable.component'
import { DetailContext } from '~/context/Detail.context'
import InfoCardTitleComponent from './components/InfoCardTitle.component'
import {
  MoveConceptNote,
  MoveEffectDescription,
} from './components/MoveDescription.component'

/**
 * 전용기(signature move) 카드 — 해당 포켓몬만 쓰는 대표 기술을 별도 섹션으로
 * 강조한다(전용 Z기술·거다이맥스 카드와 대칭). 전용기는 별도 데이터가 아니라
 * 레벨업/머신 습득 기술 중 skill.signatureMoves === true인 것이므로, 두 목록에서
 * 뽑아 skill.id로 중복 제거한 뒤 기존 MoveTable을 재활용해 표시한다.
 * 전용기가 없는 포켓몬은 렌더하지 않는다(Z기술 카드와 동일 패턴).
 */

/** GraphQL damageType(physical/special/status)을 Chip 색 키로 — 미지의 값은 변화로 폴백 */
const toChipColor = (damageType?: string | null): ChipColor => {
  const normalized = damageType?.toLowerCase()
  return normalized === 'physical' || normalized === 'special'
    ? normalized
    : 'status'
}

const DetailSignatureMovesContainer = () => {
  const { activeTypeInfo } = useContext(DetailContext)

  const levelUpSkills = activeTypeInfo.learnableSkills?.levelUpSkills ?? []
  const machineSkills = activeTypeInfo.learnableSkills?.machineSkills ?? []

  // 레벨업(습득 조건 보존)·머신 순으로 전용기만 필터. 같은 전용기가 양쪽에
  // 있으면 먼저 담긴 레벨업 조건을 유지한다(id 기준 중복 제거). 표 데이터와
  // 나란히 설명(nameKo+description)도 모아 표 아래에 노출한다.
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
      damageClass: toChipColor(skill.damageType),
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
      <InfoCardTitleComponent title="전용기" id="pokemon-signature-move" />
      <MoveTableComponent moves={signatureMoves} ariaLabel="전용기 목록" />
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

export default DetailSignatureMovesContainer
