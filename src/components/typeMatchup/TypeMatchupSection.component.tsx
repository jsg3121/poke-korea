import { PokemonType } from '~/graphql/typeGenerated'
import Tag from '~/components/tag/Tag.component'

export interface TypeMatchupRow {
  label: string
  borderClass: string
  types: Array<PokemonType>
}

interface TypeMatchupSectionProps {
  title: string
  description: string
  rows: Array<TypeMatchupRow>
}

const TypeMatchupSection = ({
  title,
  description,
  rows,
}: TypeMatchupSectionProps) => {
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

export default TypeMatchupSection
