'use client'

import { useContext, useState } from 'react'
import Link from 'next/link'

import { PokemonTypes } from '~/types/pokemonTypes.types'
import {
  EffectivenessValue,
  TYPE_EFFECTIVENESS_CHART,
  TYPE_ORDER,
} from '~/constants/typeEffectivenessChart'
import { PokemonType } from '~/graphql/typeGenerated'
import { buildTypeDetailPath } from '~/modules/typeParams.module'
import { TypeEffectivenessContext } from '~/context/TypeEffectiveness.context'

import TableActivePointer, {
  ActivePointerType,
} from './TableActivePointer.component'

const toPokemonType = (label: PokemonTypes): PokemonType =>
  Object.values(PokemonType).find(
    (type) => PokemonTypes[type] === label,
  ) as PokemonType

const VALUE_STYLE: Record<
  Exclude<EffectivenessValue, 1>,
  { label: string; color: string; active: ActivePointerType }
> = {
  2: { label: '2배', color: 'text-green-600', active: 'double' },
  0.5: { label: '0.5배', color: 'text-yellow-600', active: 'half' },
  0: { label: '0배', color: 'text-gray-500', active: 'zero' },
}

const TypeEffectivenessTable = () => {
  const { selectTypeList } = useContext(TypeEffectivenessContext)
  const [activeType, setActiveType] = useState<ActivePointerType>(undefined)

  const selectedDefenseTypes = selectTypeList.map((type) => PokemonTypes[type])

  const handleClickActiveEffective = (effectiveType: ActivePointerType) => {
    setActiveType((prev) =>
      prev === effectiveType ? undefined : effectiveType,
    )
  }

  const renderCell = (attackType: PokemonTypes, defenseType: PokemonTypes) => {
    const value = TYPE_EFFECTIVENESS_CHART[attackType][defenseType]
    const key = `cell-${attackType}-${defenseType}`
    const selectedColumn = selectedDefenseTypes.includes(defenseType)
    const columnBg = selectedColumn ? 'bg-primary-3/25' : ''
    const base = `h-10 min-w-11 border-b border-r border-solid border-primary-3/50 text-center align-middle text-xs desktop:h-12 desktop:text-sm ${columnBg}`

    if (value === 1) {
      return <td key={key} className={base} />
    }

    const { label, color, active } = VALUE_STYLE[value]
    const emphasized =
      activeType === active ? 'font-bold text-sm desktop:text-base' : ''
    const dimmed = activeType && activeType !== active ? 'opacity-30' : ''

    return (
      <td key={key} className={`${base} ${color}`}>
        <span className={`${emphasized} ${dimmed}`}>{label}</span>
      </td>
    )
  }

  return (
    <section
      className="w-full pt-8 desktop:pt-10"
      aria-labelledby="pokemon-type-effectiveness-table"
    >
      <header className="mb-3 flex flex-col gap-3 desktop:flex-row desktop:items-center desktop:justify-between">
        <h2
          id="pokemon-type-effectiveness-table"
          className="text-xl desktop:text-3xl font-semibold text-primary-4 leading-tight"
        >
          타입별 상성 표
        </h2>
        <TableActivePointer
          activeType={activeType}
          onClickPointer={handleClickActiveEffective}
          onClickResetEffective={() => setActiveType(undefined)}
        />
      </header>
      <p className="mb-3 text-sm text-primary-3">
        ※ 단일 타입 기준 배율이에요. 세로축이 공격하는 타입, 가로축이 공격받는
        타입입니다.
      </p>

      <div
        tabIndex={0}
        role="group"
        aria-label="타입별 상성 표, 가로로 스크롤할 수 있어요"
        className="w-full overflow-x-auto overflow-y-hidden rounded-2xl border border-solid border-primary-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4"
      >
        <table className="w-full border-separate border-spacing-0 bg-primary-4">
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-10 min-w-14 border-b border-r border-solid border-primary-2 bg-primary-2 p-1 text-2xs leading-tight text-white desktop:min-w-16 desktop:text-xs"
              >
                <span className="block">방어 →</span>
                <span className="block">공격 ↓</span>
              </th>
              {TYPE_ORDER.map((defenseType) => {
                const selected = selectedDefenseTypes.includes(defenseType)
                return (
                  <th
                    key={`col-${defenseType}`}
                    scope="col"
                    className={`h-10 min-w-11 border-b border-r border-solid border-primary-2 bg-primary-3 text-center align-middle text-xs text-black desktop:h-12 desktop:text-sm ${
                      selected ? 'font-bold underline underline-offset-2' : ''
                    }`}
                  >
                    {defenseType}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {TYPE_ORDER.map((attackType) => (
              <tr key={`row-${attackType}`}>
                <th
                  scope="row"
                  className="sticky left-0 z-10 h-10 min-w-14 border-b border-r border-solid border-primary-3 bg-primary-2 p-0 text-center align-middle text-xs text-white desktop:h-12 desktop:min-w-16 desktop:text-sm"
                >
                  <Link
                    href={buildTypeDetailPath(toPokemonType(attackType))}
                    aria-label={`${attackType} 타입 약점과 상성 보기`}
                    className="flex h-full w-full items-center justify-center px-1 py-2 hover:underline focus-visible:underline"
                  >
                    {attackType}
                  </Link>
                </th>
                {TYPE_ORDER.map((defenseType) =>
                  renderCell(attackType, defenseType),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default TypeEffectivenessTable
