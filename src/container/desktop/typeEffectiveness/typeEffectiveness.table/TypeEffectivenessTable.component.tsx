'use client'
import { useState } from 'react'
import {
  EffectivenessValue,
  TYPE_EFFECTIVENESS_CHART,
  TYPE_ORDER,
} from '~/constants/typeEffectivenessChart'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import TableActivePointerComponent, {
  ActivePointerType,
} from './table.activePointer/TableActivePointer.component'

const CELL_BASE =
  'w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3'

/** 상성 배율별 표시 라벨·색상·활성 강조 규칙 (desktop) */
const VALUE_STYLE: Record<
  Exclude<EffectivenessValue, 1>,
  { label: string; color: string; active: ActivePointerType }
> = {
  0.5: { label: '0.5배', color: 'text-yellow-600', active: 'half' },
  0: { label: '0배', color: 'text-gray-500', active: 'zero' },
  2: { label: '2배', color: 'text-green-600', active: 'double' },
}

const TypeEffectivenessTableComponent = () => {
  const [activeType, setActiveType] = useState<ActivePointerType>(undefined)

  const handleClickActiveEffective = (effectiveType: ActivePointerType) => {
    if (effectiveType === activeType) {
      setActiveType(() => undefined)
    } else {
      setActiveType(() => effectiveType)
    }
  }

  const handleClickResetActiveEffective = () => {
    setActiveType(() => undefined)
  }

  const renderCell = (value: EffectivenessValue, key: string) => {
    if (value === 1) {
      return <td key={key} className={CELL_BASE}></td>
    }

    const { label, color, active } = VALUE_STYLE[value]
    const emphasized = activeType === active ? 'text-lg font-semibold' : ''
    const dimmed = activeType && activeType !== active ? 'opacity-30' : ''

    return (
      <td key={key} className={`${CELL_BASE} ${color} ${emphasized} ${dimmed}`}>
        {label}
      </td>
    )
  }

  return (
    <div className="w-full h-full mb-4" aria-label="포켓몬 타입 상성표">
      <table
        className="w-full h-full bg-primary-4 table-fixed border-hidden"
        aria-labelledby="pokemon-type-effectiveness-table"
      >
        <caption className="w-full h-8 caption-top mb-2">
          <h2
            id="pokemon-type-effectiveness-table"
            className="h-8 text-[2rem] font-semibold text-aligned-base float-left text-primary-4"
          >
            타입별 상성 표
          </h2>
          <TableActivePointerComponent
            activeType={activeType}
            onClickPointer={handleClickActiveEffective}
            onClickResetEffective={handleClickResetActiveEffective}
          />
        </caption>
        <colgroup>
          <col width="5%" />
          <col width="5%" />
          {Object.keys(PokemonTypes).map((typeKey) => (
            <col key={`col-${typeKey}`} width="5%" />
          ))}
        </colgroup>
        <thead className="h-28 border-b border-solid border-gray-200">
          <tr className="w-full h-14 bg-primary-3">
            <th
              colSpan={2}
              rowSpan={2}
              className="w-[5%] h-28 text-base leading-none text-center tracking-wide text-black align-middle border-t border-solid border-primary-2 relative"
            ></th>
            <th
              colSpan={18}
              className="w-[5%] h-14 text-base leading-none text-center tracking-wide text-black align-middle border-l border-t border-solid border-primary-2"
            >
              공격 받는 포켓몬
            </th>
          </tr>
          <tr className="w-full h-14 bg-primary-3">
            {Object.entries(PokemonTypes).map(([key, value]) => {
              return (
                <th
                  key={`type-effective-table-key-${key}`}
                  scope="col"
                  className="w-[5%] h-14 text-base text-center leading-none tracking-wide text-black align-middle border-l border-t border-solid border-primary-2"
                >
                  {value}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="w-full">
          {TYPE_ORDER.map((attackType, rowIndex) => (
            <tr key={`row-${attackType}`} className="h-12">
              {rowIndex === 0 && (
                <th
                  rowSpan={TYPE_ORDER.length}
                  className="w-[5%] align-middle text-center text-base leading-[1.1rem] tracking-wide text-white bg-primary-2 border-solid border-t border-r border-primary-3"
                >
                  공격
                  <br />
                  하는
                  <br />
                  포켓몬
                </th>
              )}
              <th
                scope="row"
                className="w-[5%] align-middle text-center text-base leading-[1.1rem] tracking-wide text-white bg-primary-2 border-t border-r border-solid border-primary-3"
              >
                {attackType}
              </th>
              {TYPE_ORDER.map((defenseType) =>
                renderCell(
                  TYPE_EFFECTIVENESS_CHART[attackType][defenseType],
                  `cell-${attackType}-${defenseType}`,
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TypeEffectivenessTableComponent
