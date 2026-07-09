'use client'

import { useContext } from 'react'
import LinkButtonComponent from '~/components/button/LinkButton.component'
import { ChipColor } from '~/components/chip/chipStyle'
import MoveTableComponent, {
  MoveTableItem,
} from '~/components/moveTable/MoveTable.component'
import { DetailContext } from '~/context/Detail.context'
import InfoCardTitleComponent from './components/InfoCardTitle.component'

/**
 * 습득 기술 카드 2종 — 레벨업/머신 (반응형 단일, MoveTable 조립 — UX-005 §7-4).
 * 기존 데/모 LevelLearnableSkill·MachineLearnableSkill의 "고정 높이 + 내부
 * overflow-y 스크롤"을 폐기한다 — 페이지 스크롤 안 내부 스크롤 중첩은 기술 표
 * 가로 스크롤을 기각한 것과 같은 이유(사용자 결정)로, 상위 N개만 보여주고
 * 전체는 기존 moves 하위 페이지 링크로 유도한다.
 */

const SKILL_PREVIEW_COUNT = 10

/** GraphQL damageType(physical/special/status)을 Chip 색 키로 — 미지의 값은 변화로 폴백 */
const toChipColor = (damageType?: string | null): ChipColor => {
  const normalized = damageType?.toLowerCase()
  return normalized === 'physical' || normalized === 'special'
    ? normalized
    : 'status'
}

const DetailSkillsContainer = () => {
  const { pokemonBaseInfo, activeTypeInfo, activeType, activeIndex } =
    useContext(DetailContext)

  const pokemonNumber = pokemonBaseInfo?.number ?? 0
  const levelUpSkills = activeTypeInfo.learnableSkills?.levelUpSkills ?? []
  const machineSkills = activeTypeInfo.learnableSkills?.machineSkills ?? []
  const versionGroup = activeTypeInfo.versionGroupInfo

  const getMovesHref = () => {
    if (activeType === 'region') {
      return activeIndex > 0
        ? `/detail/${pokemonNumber}/moves/region/${activeIndex}`
        : `/detail/${pokemonNumber}/moves/region`
    }
    return activeIndex > 0
      ? `/detail/${pokemonNumber}/moves/form/${activeIndex}`
      : `/detail/${pokemonNumber}/moves`
  }

  const levelUpMoves: Array<MoveTableItem> = levelUpSkills
    .slice(0, SKILL_PREVIEW_COUNT)
    .map(({ level, skill }) => ({
      condition: level === 0 ? '진화' : level === 1 ? '최초' : `Lv.${level}`,
      name: skill.nameKo,
      type: skill.type,
      damageClass: toChipColor(skill.damageType),
      power: skill.power,
      accuracy: skill.accuracy,
      pp: skill.pp,
    }))

  const machineMoves: Array<MoveTableItem> = machineSkills
    .slice(0, SKILL_PREVIEW_COUNT)
    .map(({ skill }) => ({
      condition: '머신',
      name: skill.nameKo,
      type: skill.type,
      damageClass: toChipColor(skill.damageType),
      power: skill.power,
      accuracy: skill.accuracy,
      pp: skill.pp,
    }))

  if (levelUpMoves.length === 0 && machineMoves.length === 0) {
    return null
  }

  const skillBlocks = [
    {
      key: 'level-up',
      title: '레벨업 습득 기술',
      titleId: 'pokemon-learnable-skill',
      versionName: versionGroup?.levelUpSkillVersion?.baseVersionGroupName,
      moves: levelUpMoves,
      total: levelUpSkills.length,
      href: getMovesHref(),
      ariaLabel: '레벨업 습득 기술 목록',
    },
    {
      key: 'machine',
      title: '기술/비전 머신 습득 기술',
      titleId: 'pokemon-machine-learnable-skill',
      versionName: versionGroup?.machineSkillVersion?.baseVersionGroupName,
      moves: machineMoves,
      total: machineSkills.length,
      href: `${getMovesHref()}/machine`,
      ariaLabel: '머신 습득 기술 목록',
    },
  ].filter((block) => block.moves.length > 0)

  return (
    <div className="grid w-full grid-cols-1 gap-8 desktop:grid-cols-2 desktop:items-start">
      {skillBlocks.map((block) => (
        <section
          key={block.key}
          aria-labelledby={block.titleId}
          className="card-detail flex flex-col"
        >
          <InfoCardTitleComponent title={block.title} id={block.titleId} />
          {block.versionName && (
            <p className="mb-3 text-sm text-primary-2">
              최신 버전 : <b className="font-bold">{block.versionName}</b>
            </p>
          )}
          <MoveTableComponent moves={block.moves} ariaLabel={block.ariaLabel} />
          {/* 더보기는 개수와 무관하게 상시 노출 + 카드 하단 고정(mt-auto) —
              2컬럼에서 카드 높이가 달라도 버튼 라인이 맞는다(사용자 요청) */}
          <div className="mt-auto flex justify-center pt-4">
            <LinkButtonComponent
              href={block.href}
              variant="secondary"
              size="sm"
              showArrow
            >
              전체 기술 보기 ({block.total}개)
            </LinkButtonComponent>
          </div>
        </section>
      ))}
    </div>
  )
}

export default DetailSkillsContainer
