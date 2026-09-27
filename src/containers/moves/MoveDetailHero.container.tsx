import Link from 'next/link'

import { PokemonSkillDetail, VersionGroup } from '~/graphql/typeGenerated'
import {
  getDamageTypeChipColor,
  getDamageTypeKorean,
  hasDamageType,
} from '~/utils/skill.util'
import Chip from '~/components/chip/Chip.component'
import Tag from '~/components/tag/Tag.component'

interface MoveDetailHeroProps {
  skillData: PokemonSkillDetail
  selectedVersionGroupId?: number
  learnablePokemonCount?: number
  versionGroups?: Array<VersionGroup> | null
}

const MoveDetailHero = ({
  skillData,
  selectedVersionGroupId,
  learnablePokemonCount = 0,
  versionGroups,
}: MoveDetailHeroProps) => {
  const selectedVersionData = selectedVersionGroupId
    ? skillData.generations.find(
        (gen) => gen.versionGroupId === selectedVersionGroupId,
      )
    : undefined
  const displayData = selectedVersionData ?? skillData

  const isLatestTab = !selectedVersionGroupId
  const latestAvailableVersionGroupId = isLatestTab
    ? skillData.generations
        .filter((gen) => gen.isAvailable)
        .reduce<
          number | undefined
        >((max, gen) => (max == null || gen.versionGroupId > max ? gen.versionGroupId : max), undefined)
    : undefined

  const badgeVersionGroupId = isLatestTab
    ? latestAvailableVersionGroupId
    : selectedVersionData?.versionGroupId
  const badgeVersionName = badgeVersionGroupId
    ? versionGroups?.find((vg) => vg.versionGroupId === badgeVersionGroupId)
        ?.nameKo
    : undefined
  const versionName = badgeVersionName
    ? isLatestTab
      ? `최신 · ${badgeVersionName}`
      : badgeVersionName
    : undefined

  const damageColor = hasDamageType(displayData.damageType)
    ? getDamageTypeChipColor(displayData.damageType)
    : undefined

  return (
    <section className="w-full">
      <Link
        href="/moves"
        className="inline-flex h-9 items-center gap-1 rounded-full bg-primary-3 px-4 text-sm font-medium text-primary-1 transition-colors hover:bg-primary-2 hover:text-primary-4"
      >
        ← 기술 도감으로 돌아가기
      </Link>

      <header className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-2xl desktop:text-4xl font-bold text-primary-4 leading-tight">
          {skillData.nameKo}
        </h1>
        {versionName && <Chip label={versionName} />}
        {skillData.zMoves && skillData.isAvailable && <Chip label="Z기술" />}
        {!skillData.isAvailable && (
          <strong className="inline-block h-7 rounded-lg bg-damage-physical px-3 text-sm text-aligned-md font-medium text-primary-1">
            삭제된 기술
          </strong>
        )}
      </header>

      {isLatestTab && learnablePokemonCount > 0 && (
        <p className="mt-2 text-xs desktop:text-sm text-primary-3">
          최신 버전은 <b>습득 가능한 포켓몬이 있는 가장 최신 버전</b>을 기준으로
          보여드려요.
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {displayData.type && <Tag type={displayData.type} />}
        {damageColor && (
          <Chip
            label={getDamageTypeKorean(displayData.damageType)}
            color={damageColor}
          />
        )}
      </div>

      <dl className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        <div className="flex items-baseline gap-2">
          <dt className="text-sm text-primary-3">위력</dt>
          <dd className="text-xl desktop:text-2xl font-bold text-primary-4">
            {displayData.power ?? '-'}
          </dd>
        </div>
        <div className="flex items-baseline gap-2">
          <dt className="text-sm text-primary-3">명중률</dt>
          <dd className="text-xl desktop:text-2xl font-bold text-primary-4">
            {displayData.accuracy ?? '-'}
          </dd>
        </div>
        <div className="flex items-baseline gap-2">
          <dt className="text-sm text-primary-3">PP</dt>
          <dd className="text-xl desktop:text-2xl font-bold text-primary-4">
            {displayData.pp ?? '-'}
          </dd>
        </div>
      </dl>

      {displayData.description && (
        <p className="mt-3 text-base font-semibold text-primary-4 leading-relaxed">
          {displayData.description}
        </p>
      )}
    </section>
  )
}

export default MoveDetailHero
