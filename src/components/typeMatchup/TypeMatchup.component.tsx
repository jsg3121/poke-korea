import TagComponent from '~/components/tag/Tag.component'
import { PokemonType } from '~/graphql/typeGenerated'

/**
 * 타입 상성 (DS). 방어 상성 배율별 타입 그룹을 약점/강점 두 섹션으로 **동시 노출**한다.
 *
 * 기존 UI(강점/약점 토글)는 비교가 필요한 정보를 반쪽씩 숨겨 이번 개편의 탭 회피
 * 원칙(Baymard·NN/g — RES-003)과 모순이었다. 약점을 먼저 배치한다(실전에서 "무엇을
 * 피해야 하나"가 우선 — pokemon.com도 약점만 노출).
 *
 * 배율 표기는 "텍스트형"(타입 계산기 TypeCalculatorResult와 통일 — 2026-07-20
 * 사용자 확정 규칙 승계): 배율을 배지가 아니라 크고 굵은 문장 + 행 좌측 grade 색
 * 보더로 표기한다. 타입만 배지(Tag)로 남겨 "배지=타입" 단일 규칙으로 배율-타입
 * 혼동을 원천 차단한다(구 배지형은 배율·타입이 같은 크기 배지라 혼동).
 *
 * 문장 색은 grade 색이 아니라 진한 기본색(primary-1)을 쓴다 — 이 카드 배경은
 * 밝은 primary-4라 grade 색(어두운 계산기 배경용)은 대비가 1.1~2.4로 WCAG 1.4.3
 * (3:1) 미달이다. 위험도 색 신호는 좌측 grade 색 보더가 담당하고, 문장은 진한
 * 색으로 가독성을 확보한다(문장+보더 병기라 색 단독 의존 아님 — WCAG 1.4.1).
 *
 * props는 calculateRelationType 산출 형태와 1:1. 빈 배율 행은 렌더하지 않는다.
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
  /** 배율 설명 문장 (예: "받는 데미지 4배") — 방어 관점 유지 */
  label: string
  /** 좌측 grade 색 보더 (위험도 신호, 정적 매핑 purge 안전) */
  borderClass: string
  types: Array<PokemonType>
}

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
      <dl className="flex flex-col gap-3">
        {visibleRows.map((row) => (
          <div
            key={row.label}
            className={`border-l-4 border-solid pl-3 ${row.borderClass}`}
          >
            <dt className="text-sm font-bold text-primary-1 desktop:text-base">
              {row.label}
            </dt>
            <dd className="m-0 mt-1.5 flex flex-wrap gap-1.5">
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
      label: '받는 데미지 4배',
      borderClass: 'border-grade-danger',
      types: quad,
    },
    {
      label: '받는 데미지 2배',
      borderClass: 'border-grade-warning',
      types: double,
    },
  ]
  const resistRows: Array<MatchupRow> = [
    {
      label: '받는 데미지 0.5배',
      borderClass: 'border-grade-good',
      types: half,
    },
    {
      label: '받는 데미지 0.25배',
      borderClass: 'border-grade-better',
      types: quarter,
    },
    {
      label: '데미지를 받지 않음',
      borderClass: 'border-grade-best',
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
