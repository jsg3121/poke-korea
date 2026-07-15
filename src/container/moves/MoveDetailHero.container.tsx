import Link from 'next/link'
import ChipComponent from '~/components/chip/Chip.component'
import { ChipColor } from '~/components/chip/chipStyle'
import TagComponent from '~/components/tag/Tag.component'
import { PokemonSkillDetail, VersionGroup } from '~/graphql/typeGenerated'
import { getDamageTypeKorean } from '~/utils/skill.util'

/**
 * 기술 상세 미니 히어로 (반응형 단일 — UX-008). 구버전 MoveDetail.component
 * (데/모 dl 2벌 + 임의값 text-[2.5rem]·chip-type-*·text-damage-*)를 대체한다.
 *
 * 기술은 이미지가 없는 텍스트 도메인이라 이미지 슬롯 없이 "뒤로가기 + 좌측 제목 +
 * 배지 + 스탯 dl + 설명" 구조로 구성한다 — ability 상세 Hero의 톤과 통일.
 * 타입은 Tag, 데미지 분류는 Chip(color) 원자로 통일한다(목록 카드·MoveTable과
 * 동일 색 매핑). 본문은 text-base 반응형 토큰(ADR-0012).
 *
 * 버전별 조회(/moves/[id]/version/[vgId]) 시 해당 세대 데이터(generations)를
 * 우선 표시하고, 어떤 버전 기준인지 배지로 알린다.
 */

/** 백엔드 damageType(소문자) → Chip color 매핑 */
const DAMAGE_CHIP_COLOR: Record<string, ChipColor> = {
  physical: 'physical',
  special: 'special',
  status: 'status',
}

interface MoveDetailHeroContainerProps {
  skillData: PokemonSkillDetail
  selectedVersionGroupId?: number
  versionGroups?: Array<VersionGroup> | null
}

const MoveDetailHeroContainer = ({
  skillData,
  selectedVersionGroupId,
  versionGroups,
}: MoveDetailHeroContainerProps) => {
  // 선택된 버전의 세대 데이터가 있으면 우선 사용(위력·명중 등이 세대마다 다르다)
  const selectedVersionData = selectedVersionGroupId
    ? skillData.generations.find(
        (gen) => gen.versionGroupId === selectedVersionGroupId,
      )
    : undefined
  const displayData = selectedVersionData ?? skillData

  const versionName = selectedVersionData
    ? versionGroups?.find(
        (vg) => vg.versionGroupId === selectedVersionData.versionGroupId,
      )?.nameKo
    : undefined

  const damageColor = displayData.damageType
    ? DAMAGE_CHIP_COLOR[displayData.damageType.toLowerCase()]
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
        {versionName && <ChipComponent label={`${versionName} 기준`} />}
        {skillData.zMoves && skillData.isAvailable && (
          <ChipComponent label="Z기술" />
        )}
        {!skillData.isAvailable && (
          <strong className="inline-block h-7 rounded-lg bg-damage-physical px-3 text-sm text-aligned-md font-medium text-primary-1">
            삭제된 기술
          </strong>
        )}
      </header>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {displayData.type && <TagComponent type={displayData.type} />}
        {damageColor && (
          <ChipComponent
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

export default MoveDetailHeroContainer
