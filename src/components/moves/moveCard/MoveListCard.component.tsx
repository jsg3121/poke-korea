import Link from 'next/link'
import ChipComponent from '~/components/chip/Chip.component'
import { ChipColor } from '~/components/chip/chipStyle'
import TagComponent from '~/components/tag/Tag.component'
import { PokemonSkill } from '~/graphql/typeGenerated'
import { getDamageTypeKorean } from '~/utils/skill.util'

/**
 * 기술 목록 카드 (DS). 기술 도감(/moves) 목록의 기술 항목 하나를 표시한다 (UX-008).
 *
 * 기술은 이미지가 없는 텍스트 도메인이라 포켓몬 카드 셸이 아니라 AbilityCard·
 * HubLinkCard와 같은 "밝은 배경(primary-4) + 진한 텍스트" 카드 문법을 공유한다.
 * 타입은 Tag, 데미지 분류는 Chip(color) 원자로 통일한다 — MoveTable과 동일한
 * 색 매핑이라 도감 전체에서 분류 색 표현이 일치한다(구버전 badge-damage-* 유틸·
 * chip-type-* 임의 클래스 제거).
 *
 * 위력/명중/PP는 dl 3분할(넉넉한 밀도)로 유지한다 — 모바일 1열 그리드 확정
 * (UX-008 §10-1, 시안 비교 후 사용자 결정)이라 카드 폭이 충분하다.
 */

/** 백엔드 damageType(소문자) → Chip color 매핑. 그 외 값은 Chip 생략 */
const DAMAGE_CHIP_COLOR: Record<string, ChipColor> = {
  physical: 'physical',
  special: 'special',
  status: 'status',
}

interface MoveListCardProps {
  moveData: PokemonSkill
}

const MoveListCardComponent = ({ moveData }: MoveListCardProps) => {
  const damageColor = moveData.damageType
    ? DAMAGE_CHIP_COLOR[moveData.damageType.toLowerCase()]
    : undefined

  return (
    <Link
      href={`/moves/${moveData.id}`}
      className="block w-full"
      aria-label={`${moveData.nameKo} 기술 상세보기`}
    >
      <article className="w-full min-h-44 bg-primary-4 border-2 border-solid border-primary-1 rounded-xl shadow-[0_0_0_3px_var(--color-primary-4)] p-3 pb-10 relative transition-transform duration-150 desktop:hover:-translate-y-0.5">
        <header className="mb-3 pb-2 border-b border-solid border-primary-1 flex items-start justify-between gap-2">
          <h3 className="text-lg desktop:text-xl font-bold text-gray-900 leading-tight">
            <span className="text-sm font-normal text-primary-2">
              {moveData.id}.
            </span>
            &nbsp;
            {moveData.nameKo}
          </h3>
          {/* 배지 묶음 — shrink-0으로 배지는 유지, 제목이 길면 제목만 줄바꿈 */}
          <div className="flex shrink-0 items-center gap-1.5">
            {moveData.zMoves && <ChipComponent label="Z기술" />}
            {moveData.type && <TagComponent type={moveData.type} />}
            {damageColor && (
              <ChipComponent
                label={getDamageTypeKorean(moveData.damageType)}
                color={damageColor}
              />
            )}
          </div>
        </header>
        <dl className="grid grid-cols-3 text-center">
          <div className="border-r border-solid border-primary-2/40">
            <dt className="mb-1 text-xs text-primary-2">위력</dt>
            <dd className="text-xl font-bold text-primary-1">
              {moveData.power ?? '-'}
            </dd>
          </div>
          <div className="border-r border-solid border-primary-2/40">
            <dt className="mb-1 text-xs text-primary-2">명중률</dt>
            <dd className="text-xl font-bold text-primary-1">
              {moveData.accuracy ?? '-'}
            </dd>
          </div>
          <div>
            <dt className="mb-1 text-xs text-primary-2">PP</dt>
            <dd className="text-xl font-bold text-primary-1">
              {moveData.pp ?? '-'}
            </dd>
          </div>
        </dl>
        <p className="absolute bottom-3 left-3 text-sm desktop:text-xs text-primary-2 font-semibold">
          세대별 기술 정보 보러가기 &gt;
        </p>
      </article>
    </Link>
  )
}

export default MoveListCardComponent
