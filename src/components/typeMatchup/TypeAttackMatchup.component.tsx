import TagComponent from '~/components/tag/Tag.component'
import { PokemonType } from '~/graphql/typeGenerated'

/**
 * 공격 상성 (타입 상세 전용) — "이 타입으로 공격할 때" 배율별 상대 타입.
 *
 * ## 왜 TypeMatchup을 재사용하지 않았나
 *
 * `TypeMatchup.component.tsx`는 라벨이 `받는 데미지 N배`, 섹션 제목이 `약점`/`강점`
 * 으로 **방어 관점에 하드코딩**돼 있다. 공격 관점에 쓰려면 라벨을 prop으로 빼야
 * 하는데, 그러면 이미 상세 페이지에서 쓰이는 DS 컴포넌트의 시그니처가 바뀐다.
 * 공격 상성은 배율 종류도 3개(2배·0.5배·0배)로 방어(5개)보다 단순해, **별도
 * 컴포넌트를 두는 편이 기존 사용처에 안전**하다.
 *
 * 시각 규격(좌측 grade 색 보더 + 배율 문장 + 타입 Tag)은 `TypeMatchup`을 그대로
 * 따른다 — 같은 페이지에서 방어/공격이 나란히 놓이므로 형태가 달라지면 안 된다.
 *
 * 배율 색은 **공격자 관점**으로 뒤집는다. 방어에서 "2배로 받는다"는 나쁜 일이라
 * 경고색이지만, 공격에서 "2배로 넣는다"는 좋은 일이다.
 */

export interface TypeAttackMatchupProps {
  /** ×2 — 효과가 굉장하다 */
  double: Array<PokemonType>
  /** ×0.5 — 효과가 별로다 */
  half: Array<PokemonType>
  /** ×0 — 효과가 없다 */
  zero: Array<PokemonType>
}

interface AttackRow {
  label: string
  borderClass: string
  types: Array<PokemonType>
}

const TypeAttackMatchupComponent = ({
  double,
  half,
  zero,
}: TypeAttackMatchupProps) => {
  const rows: Array<AttackRow> = [
    {
      label: '주는 데미지 2배',
      // 공격자에게 유리 → 좋음 계열 색
      borderClass: 'border-grade-best',
      types: double,
    },
    {
      label: '주는 데미지 0.5배',
      borderClass: 'border-grade-warning',
      types: half,
    },
    {
      label: '데미지를 주지 못함',
      borderClass: 'border-grade-danger',
      types: zero,
    },
  ]

  const visibleRows = rows.filter((row) => row.types.length > 0)
  if (visibleRows.length === 0) return null

  return (
    <dl className="flex w-full flex-col gap-3">
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
  )
}

export default TypeAttackMatchupComponent
