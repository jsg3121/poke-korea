import { PokemonType } from '~/graphql/typeGenerated'
import Tag from '~/components/tag/Tag.component'

export interface TypeAttackMatchupProps {
  double: Array<PokemonType>
  half: Array<PokemonType>
  zero: Array<PokemonType>
}

interface AttackRow {
  label: string
  borderClass: string
  types: Array<PokemonType>
}

const TypeAttackMatchup = ({ double, half, zero }: TypeAttackMatchupProps) => {
  const rows: Array<AttackRow> = [
    {
      label: '주는 데미지 2배',
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
              <Tag key={type} type={type} />
            ))}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export default TypeAttackMatchup
