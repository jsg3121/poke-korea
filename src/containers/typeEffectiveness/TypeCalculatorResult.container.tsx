'use client'

import { useContext } from 'react'
import Link from 'next/link'

import { PokemonTypes } from '~/types/pokemonTypes.types'
import { PokemonType } from '~/graphql/typeGenerated'
import { calculateRelationType } from '~/modules/calculateRelationType.module'
import { TypeEffectivenessContext } from '~/context/TypeEffectiveness.context'
import Tag from '~/components/tag/Tag.component'

import TypeEffectivenessCta from './TypeEffectivenessCta.container'

interface ResultRow {
  description: string
  textClass: string
  borderClass: string
  types: Array<PokemonType>
}

const ResultSection = ({
  title,
  rows,
}: {
  title: string
  rows: Array<ResultRow>
}) => {
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

const TypeCalculatorResult = () => {
  const { selectTypeList } = useContext(TypeEffectivenessContext)

  const { double, half, quad, quarter, zero } =
    calculateRelationType(selectTypeList)

  const hasSelection = selectTypeList.length > 0
  const selectTypeListKo = selectTypeList
    .map((type) => PokemonTypes[type])
    .join(' + ')

  const recommendRows: Array<ResultRow> = [
    {
      description: '4배의 데미지를 줄 수 있어요',
      textClass: 'text-grade-danger',
      borderClass: 'border-grade-danger',
      types: quad,
    },
    {
      description: '2배의 데미지를 줄 수 있어요',
      textClass: 'text-grade-warning',
      borderClass: 'border-grade-warning',
      types: double,
    },
  ]
  const cautionRows: Array<ResultRow> = [
    {
      description: '0.5배의 데미지만 줄 수 있어요',
      textClass: 'text-grade-good',
      borderClass: 'border-grade-good',
      types: half,
    },
    {
      description: '0.25배의 데미지만 줄 수 있어요',
      textClass: 'text-grade-better',
      borderClass: 'border-grade-better',
      types: quarter,
    },
    {
      description: '데미지를 줄 수 없어요',
      textClass: 'text-grade-best',
      borderClass: 'border-grade-best',
      types: zero,
    },
  ]

  return (
    <div className="w-full">
      <p aria-live="polite" className="sr-only">
        {hasSelection
          ? `${selectTypeListKo} 타입 상성 결과가 표시되었습니다`
          : ''}
      </p>
      {hasSelection && (
        <section className="w-full pt-6 desktop:pt-8">
          <h2 className="text-xl desktop:text-3xl font-semibold text-primary-4 leading-tight">
            {selectTypeListKo} 타입은 이렇게 상대하세요!
          </h2>
          <p className="mt-2 text-base text-primary-4/80">
            타입을 누르면 해당 타입 포켓몬을 도감에서 볼 수 있어요.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 desktop:grid-cols-2 desktop:gap-8">
            <ResultSection
              title="이런 타입을 쓰면 좋아요!"
              rows={recommendRows}
            />
            <ResultSection
              title="이런 타입은 조심해야 해요!"
              rows={cautionRows}
            />
          </div>

          <TypeEffectivenessCta />
        </section>
      )}
    </div>
  )
}

export default TypeCalculatorResult
