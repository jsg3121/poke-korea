import ChipComponent from '~/components/chip/Chip.component'
import { ChipColor } from '~/components/chip/chipStyle'
import TagComponent from '~/components/tag/Tag.component'
import { PokemonType } from '~/graphql/typeGenerated'

/**
 * 습득 기술 목록 (DS). 기술 1건 = 습득조건·기술명·타입·분류·위력·명중·PP.
 *
 * 반응형 단일 마크업(ADR-0007 — 데/모 2벌·display:none 중복 금지):
 * - 모바일: 컴팩트 2줄 행 — 1줄(조건+기술명+타입 태그+분류 칩) / 2줄(위력·명중·PP
 *   라벨쌍). 가로 스크롤 표는 페이지 세로 스크롤과 축이 중첩되어 폐기했다(UX-005 §7-4).
 * - 데스크톱: 같은 마크업이 정렬된 표 형태로 — 줄 래퍼를 `display: contents`로
 *   해체해 li의 flex 행에 셀들이 직접 참여하고, 고정 폭 토큰으로 열을 맞춘다.
 *   셀 DOM 순서가 곧 데스크톱 열 순서다(조건·기술명·타입·분류·위력·명중·PP).
 *
 * 시맨틱은 ul/li(기술 목록) + 값마다 인라인 라벨(위력/명중/PP)이다. 라벨은 모바일에서
 * 보이고 데스크톱에선 sr-only로 남아 스크린리더는 폭과 무관하게 항상 "위력 110"처럼
 * 읽는다 — 그래서 데스크톱 열 헤더는 장식(aria-hidden)이다.
 */

export interface MoveTableItem {
  /** 습득 조건 라벨 (예: 'Lv.12', '진화', '최초', '머신') */
  condition: string
  /** 기술명 */
  name: string
  type: PokemonType
  /** 데미지 유형 (물리/특수/변화) */
  damageClass: ChipColor
  power?: number | null
  accuracy?: number | null
  pp?: number | null
}

interface MoveTableProps {
  moves: MoveTableItem[]
  /** 목록 라벨 (예: '레벨업 습득 기술 목록') */
  ariaLabel: string
}

const DAMAGE_LABEL: Record<ChipColor, string> = {
  physical: '물리',
  special: '특수',
  status: '변화',
}

/** 데스크톱 열 폭 — 헤더와 셀이 같은 토큰을 공유해야 열이 맞는다 */
const COL = {
  condition: 'desktop:w-14',
  type: 'desktop:w-14',
  damage: 'desktop:w-16',
  stat: 'desktop:w-12',
}

/** 위력/명중/PP 셀 — 라벨은 모바일 표시, 데스크톱 sr-only(열 헤더가 대신함) */
const MoveStat = ({
  label,
  value,
}: {
  label: string
  value?: number | null
}) => (
  <span
    className={`text-xs text-primary-2 ${COL.stat} desktop:shrink-0 desktop:text-center`}
  >
    <span className="desktop:sr-only">{label} </span>
    <b className="text-sm font-bold text-primary-1">{value ?? '-'}</b>
  </span>
)

const MoveTableComponent = ({ moves, ariaLabel }: MoveTableProps) => {
  return (
    <div className="w-full">
      <div
        aria-hidden="true"
        className="hidden items-center gap-2 rounded-lg bg-primary-1/5 px-3 py-2 text-xs font-semibold text-primary-2 desktop:flex"
      >
        <span className={`${COL.condition} shrink-0 text-center`}>습득</span>
        <span className="flex-1">기술명</span>
        <span className={`${COL.type} shrink-0 text-center`}>타입</span>
        <span className={`${COL.damage} shrink-0 text-center`}>분류</span>
        <span className={`${COL.stat} shrink-0 text-center`}>위력</span>
        <span className={`${COL.stat} shrink-0 text-center`}>명중</span>
        <span className={`${COL.stat} shrink-0 text-center`}>PP</span>
      </div>
      <ul aria-label={ariaLabel}>
        {moves.map((move, index) => (
          <li
            key={`${move.name}-${move.condition}-${index}`}
            className="border-b border-primary-1/10 px-3 py-2.5 last:border-b-0 desktop:flex desktop:items-center desktop:gap-2"
          >
            <div className="flex flex-wrap items-center gap-2 desktop:contents">
              <span
                className={`min-w-10 rounded-lg bg-primary-1/10 px-2 py-0.5 text-center text-2xs font-bold text-primary-2 ${COL.condition} desktop:shrink-0`}
              >
                {move.condition}
              </span>
              <span className="mr-auto text-sm font-bold text-primary-1 desktop:mr-0 desktop:flex-1">
                {move.name}
              </span>
              <span
                className={`inline-flex ${COL.type} desktop:shrink-0 desktop:justify-center`}
              >
                <TagComponent type={move.type} />
              </span>
              <span
                className={`inline-flex ${COL.damage} desktop:shrink-0 desktop:justify-center`}
              >
                <ChipComponent
                  label={DAMAGE_LABEL[move.damageClass]}
                  color={move.damageClass}
                />
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-4 desktop:contents">
              <MoveStat label="위력" value={move.power} />
              <MoveStat label="명중" value={move.accuracy} />
              <MoveStat label="PP" value={move.pp} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MoveTableComponent
