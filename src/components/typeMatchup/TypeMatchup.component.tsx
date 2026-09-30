import { PokemonType } from '~/graphql/typeGenerated'
import Tag from '~/components/tag/Tag.component'

export interface TypeMatchupProps {
  quad: Array<PokemonType>
  double: Array<PokemonType>
  half: Array<PokemonType>
  quarter: Array<PokemonType>
  zero: Array<PokemonType>
}

interface MatchupRow {
  label: string
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
                <Tag key={type} type={type} />
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

const TypeMatchup = ({
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

export default TypeMatchup
