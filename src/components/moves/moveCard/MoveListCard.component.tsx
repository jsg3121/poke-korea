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
 *
 * 밀도는 모바일 퍼스트 2단(로컬 확인 피드백 2026-07-20): 모바일은 1열이라
 * 카드 높이가 곧 화면당 노출 수라 패딩·폰트를 한 단계 줄이고, 데스크톱은
 * 다열 그리드라 넉넉한 규격을 유지한다. 기술명은 9자 이상이면 한 단계 더
 * 축소한다(A그룹 DetailMovesHero의 긴 이름 축소 규칙 승계).
 */

/** 이름이 길면 폰트를 한 단계 줄이는 기준 (A그룹 선례와 동일) */
const LONG_NAME_LENGTH = 9

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

  // 긴 기술명(9자+)은 한 단계 축소 — 배지와 한 줄 경합 시 줄바꿈을 완화
  const nameSizeClass =
    moveData.nameKo.length >= LONG_NAME_LENGTH
      ? 'text-sm desktop:text-base'
      : 'text-base desktop:text-lg'

  return (
    <Link
      href={`/moves/${moveData.id}`}
      className="block w-full"
      aria-label={`${moveData.nameKo} 기술 상세보기`}
    >
      {/* min-h는 스켈레톤과 규격 공유(CLS) — 모바일은 1열이라 높이를 압축(min-h-32),
          하단 링크 예약(pb)도 링크 폰트에 맞춰 축소해 스펙-링크 사이 공백을 줄인다 */}
      <article className="w-full min-h-32 bg-primary-4 border-2 border-solid border-primary-1 rounded-xl shadow-[0_0_0_3px_var(--color-primary-4)] p-2.5 pb-8 relative transition-transform duration-150 desktop:min-h-36 desktop:p-3 desktop:pb-9 desktop:hover:-translate-y-0.5">
        <header className="mb-2 pb-1.5 border-b border-solid border-primary-1 flex items-start justify-between gap-2 desktop:mb-3 desktop:pb-2">
          <h3
            className={`${nameSizeClass} font-bold text-gray-900 leading-tight`}
          >
            <span className="text-xs desktop:text-sm font-normal text-primary-2">
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
            <dt className="mb-0.5 text-xs text-primary-2">위력</dt>
            <dd className="text-lg desktop:text-xl font-bold text-primary-1">
              {moveData.power ?? '-'}
            </dd>
          </div>
          <div className="border-r border-solid border-primary-2/40">
            <dt className="mb-0.5 text-xs text-primary-2">명중률</dt>
            <dd className="text-lg desktop:text-xl font-bold text-primary-1">
              {moveData.accuracy ?? '-'}
            </dd>
          </div>
          <div>
            <dt className="mb-0.5 text-xs text-primary-2">PP</dt>
            <dd className="text-lg desktop:text-xl font-bold text-primary-1">
              {moveData.pp ?? '-'}
            </dd>
          </div>
        </dl>
        <p className="absolute bottom-2.5 left-2.5 text-xs text-primary-2 font-semibold desktop:bottom-3 desktop:left-3">
          세대별 기술 정보 보러가기 &gt;
        </p>
      </article>
    </Link>
  )
}

export default MoveListCardComponent
