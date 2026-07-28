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
  /** 이 기술을 배우는 포켓몬 수 — "최신" 탭 툴팁 표시 여부 판단용(0이면 툴팁 숨김) */
  learnablePokemonCount?: number
  versionGroups?: Array<VersionGroup> | null
}

const MoveDetailHeroContainer = ({
  skillData,
  selectedVersionGroupId,
  learnablePokemonCount = 0,
  versionGroups,
}: MoveDetailHeroContainerProps) => {
  // 선택된 버전의 세대 데이터가 있으면 우선 사용(위력·명중 등이 세대마다 다르다)
  const selectedVersionData = selectedVersionGroupId
    ? skillData.generations.find(
        (gen) => gen.versionGroupId === selectedVersionGroupId,
      )
    : undefined
  const displayData = selectedVersionData ?? skillData

  // "최신" 탭 = 특정 버전 미선택. 이때 배지는 이 기술이 데이터상 남아 있는(isAvailable=true)
  // 가장 마지막 버전을 표시한다. 삭제된 기술은 최신 게임에도 generations 레코드가
  // is_available=false로 남아 있어, 단순 max(versionGroupId)가 아니라 isAvailable 필터
  // 후의 최대 버전을 잡아야 한다(2026-07-27).
  const isLatestTab = !selectedVersionGroupId
  const latestAvailableVersionGroupId = isLatestTab
    ? skillData.generations
        .filter((gen) => gen.isAvailable)
        .reduce<
          number | undefined
        >((max, gen) => (max == null || gen.versionGroupId > max ? gen.versionGroupId : max), undefined)
    : undefined

  // 배지 버전명: 특정 버전 선택 시 그 버전명, "최신" 탭이면 isAvailable 최신 버전명.
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
        {versionName && <ChipComponent label={versionName} />}
        {skillData.zMoves && skillData.isAvailable && (
          <ChipComponent label="Z기술" />
        )}
        {!skillData.isAvailable && (
          <strong className="inline-block h-7 rounded-lg bg-damage-physical px-3 text-sm text-aligned-md font-medium text-primary-1">
            삭제된 기술
          </strong>
        )}
      </header>

      {/* "최신" 탭의 습득 포켓몬 목록은 이 기술을 배우는 포켓몬이 있는 가장 최신 버전을
          기준으로 노출된다(버전 미지정 조회 → 백엔드가 습득 있는 최신 버전 반환). 배지
          버전(기술 정보 기준)과 다를 수 있어 상시 캡션으로 안내한다. 배울 수 있는
          포켓몬이 아예 없으면(learnablePokemonCount 0) 기준 버전이 없으므로 캡션을 숨긴다. */}
      {isLatestTab && learnablePokemonCount > 0 && (
        <p className="mt-2 text-xs desktop:text-sm text-primary-3">
          최신 버전은 <b>습득 가능한 포켓몬이 있는 가장 최신 버전</b>을 기준으로
          보여드려요.
        </p>
      )}

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
