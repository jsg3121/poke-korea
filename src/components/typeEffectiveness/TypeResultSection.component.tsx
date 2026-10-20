import Link from 'next/link'

import { PokemonTypes } from '~/types/pokemonTypes.types'
import { PokemonType } from '~/graphql/typeGenerated'
import Tag from '~/components/tag/Tag.component'

export interface TypeResultRow {
  description: string
  textClass: string
  borderClass: string
  types: Array<PokemonType>
}

interface TypeResultSectionProps {
  title: string
  rows: Array<TypeResultRow>
}

const TypeResultSection = ({ title, rows }: TypeResultSectionProps) => {
  const visibleRows = rows.filter((row) => row.types.length > 0)
  if (visibleRows.length === 0) return null

  return (
    <article className="w-full rounded-2xl bg-primary-2 p-4 desktop:p-6">
      <h3 className="mb-4 text-lg desktop:text-xl font-bold text-primary-4">
        {title}
      </h3>
      <dl className="flex flex-col gap-4">
        {visibleRows.map((row) => (
          <div
            key={row.description}
            className={`border-l-4 border-solid pl-3 ${row.borderClass}`}
          >
            <dt
              className={`text-base desktop:text-lg font-bold ${row.textClass}`}
            >
              {row.description}
            </dt>
            <dd className="m-0 mt-2 flex flex-wrap items-center gap-1.5">
              {row.types.map((type) => (
                <Link
                  key={type}
                  href={`/list?type=${type}`}
                  aria-label={`${PokemonTypes[type]} 타입 포켓몬 도감 보기`}
                  className="inline-flex rounded-lg p-0.5 transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4"
                >
                  <Tag type={type} />
                </Link>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  )
}

export default TypeResultSection
