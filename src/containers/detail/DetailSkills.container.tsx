'use client'

import { useContext } from 'react'

import { getDamageTypeChipColor } from '~/utils/skill.util'
import { DetailContext } from '~/context/Detail.context'
import LinkButton from '~/components/button/LinkButton.component'
import MoveTable, {
  MoveTableItem,
} from '~/components/moveTable/MoveTable.component'

import InfoCardTitle from './components/InfoCardTitle.component'

const SKILL_PREVIEW_COUNT = 5

const DetailSkills = () => {
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
      damageClass: getDamageTypeChipColor(skill.damageType),
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
      damageClass: getDamageTypeChipColor(skill.damageType),
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
          <InfoCardTitle title={block.title} id={block.titleId} />
          {block.versionName && (
            <p className="mb-3 text-sm text-primary-2">
              최신 버전 : <b className="font-bold">{block.versionName}</b>
            </p>
          )}
          <MoveTable moves={block.moves} ariaLabel={block.ariaLabel} />
          <div className="mt-auto flex justify-center pt-4">
            <LinkButton
              href={block.href}
              variant="secondary"
              size="sm"
              showArrow
            >
              전체 기술 보기 ({block.total}개)
            </LinkButton>
          </div>
        </section>
      ))}
    </div>
  )
}

export default DetailSkills
