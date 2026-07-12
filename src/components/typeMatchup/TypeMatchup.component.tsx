import TagComponent from '~/components/tag/Tag.component'
import { PokemonType } from '~/graphql/typeGenerated'

/**
 * 타입 상성 (DS). 방어 상성 배율별 타입 그룹을 약점/강점 두 섹션으로 **동시 노출**한다.
 *
 * 기존 UI(강점/약점 토글)는 비교가 필요한 정보를 반쪽씩 숨겨 이번 개편의 탭 회피
 * 원칙(Baymard·NN/g — RES-003)과 모순이었다. 약점을 먼저 배치한다(실전에서 "무엇을
 * 피해야 하나"가 우선 — pokemon.com도 약점만 노출). 배율은 색+기호 병기(색 단독
 * 의존 금지, WCAG 1.4.1)이고 색은 grade-* 토큰(구 TypeList 임의값을 정규화).
 *
 * props는 calculateRelationType 산출 형태와 1:1 — 상세 페이지와 타입 상성 계산기가
 * 공유하는 DS 자산이다. 빈 배율 행은 렌더하지 않는다.
 */

export interface TypeMatchupProps {
  /** ×4 — 치명적 약점 */
  quad: Array<PokemonType>
  /** ×2 — 약점 */
  double: Array<PokemonType>
  /** ×0.5 — 반감 */
  half: Array<PokemonType>
  /** ×0.25 — 강한 반감 */
  quarter: Array<PokemonType>
  /** ×0 — 무효 */
  zero: Array<PokemonType>
}

interface MatchupRow {
  label: string
  /** 스크린리더용 배율 설명 (예: "받는 데미지 4배") */
  srLabel: string
  colorClass: string
  types: Array<PokemonType>
}

// Tag와 동일한 수직 규격(h-5/h-6 + 높이+2px 라인하이트, Gmarket 보정) —
// py 기반 높이는 태그와 몇 px씩 어긋난다(QA 라운드 6)
const BADGE_CLASS =
  'inline-block h-5 w-12 shrink-0 rounded-lg text-center text-2xs font-bold leading-[calc(1.25rem+2px)] text-black-2 desktop:h-6 desktop:text-xs desktop:leading-[calc(1.5rem+2px)]'

const MatchupSection = ({
  title,
  description,
  rows,
}: {
  title: string
  description: string
  rows: Array<MatchupRow>
}) => {
  const visibleRows = rows.filter((row) => row.types.length > 0)
  if (visibleRows.length === 0) return null

  return (
    <section aria-label={`${title} — ${description}`}>
      <h3 className="mb-2 text-sm font-bold text-primary-1 desktop:text-base">
        {title}{' '}
        <span className="text-2xs font-normal text-primary-2 desktop:text-xs">
          {description}
        </span>
      </h3>
      <dl className="flex flex-col gap-2">
        {visibleRows.map((row) => (
          <div key={row.label} className="flex items-start gap-2">
            <dt className={`${BADGE_CLASS} ${row.colorClass}`}>
              <span aria-hidden="true">{row.label}</span>
              <span className="sr-only">{row.srLabel}</span>
            </dt>
            <dd className="m-0 flex flex-wrap gap-1.5">
              {row.types.map((type) => (
                <TagComponent key={type} type={type} />
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

const TypeMatchupComponent = ({
  quad,
  double,
  half,
  quarter,
  zero,
}: TypeMatchupProps) => {
  const weaknessRows: Array<MatchupRow> = [
    {
      label: '×4',
      srLabel: '받는 데미지 4배',
      colorClass: 'bg-grade-danger',
      types: quad,
    },
    {
      label: '×2',
      srLabel: '받는 데미지 2배',
      colorClass: 'bg-grade-warning',
      types: double,
    },
  ]
  const resistRows: Array<MatchupRow> = [
    {
      label: '×0.5',
      srLabel: '받는 데미지 0.5배',
      colorClass: 'bg-grade-good',
      types: half,
    },
    {
      label: '×0.25',
      srLabel: '받는 데미지 0.25배',
      colorClass: 'bg-grade-better',
      types: quarter,
    },
    {
      label: '×0',
      srLabel: '데미지를 받지 않음',
      colorClass: 'bg-grade-best',
      types: zero,
    },
  ]

  const isEmpty = [...weaknessRows, ...resistRows].every(
    (row) => row.types.length === 0,
  )
  if (isEmpty) return null

  return (
    <div className="grid w-full grid-cols-1 gap-4 desktop:grid-cols-2 desktop:gap-8">
      <MatchupSection
        title="약점"
        description="받는 데미지 증가"
        rows={weaknessRows}
      />
      <MatchupSection
        title="강점"
        description="받는 데미지 감소"
        rows={resistRows}
      />
    </div>
  )
}

export default TypeMatchupComponent
