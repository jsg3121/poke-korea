'use client'

import { useId } from 'react'

import { PokemonStats } from '~/graphql/typeGenerated'
import { useReplayProgress } from '~/hooks/useReplayProgress'
import StatBarAnimatedValue from '~/components/statBar/StatBarAnimatedValue.component'

import DetailHpNatureTip from './DetailHpNatureTip.component'
import {
  getRealStatBarMax,
  getRealStatColumnExtremes,
  getRealStatTable,
  RealStatColumn,
  StatKey,
} from './modules/statRealValue.module'

interface DetailRealStatTableProps {
  stats: PokemonStats
  replayKey: number
}

const ROWS: ReadonlyArray<{ key: StatKey; label: string }> = [
  { key: 'hp', label: '체력' },
  { key: 'attack', label: '공격' },
  { key: 'specialAttack', label: '특수공격' },
  { key: 'defense', label: '방어' },
  { key: 'specialDefense', label: '특수방어' },
  { key: 'speed', label: '스피드' },
]

const COLUMNS: ReadonlyArray<RealStatColumn> = [
  'noInvestment',
  'maxInvestment',
  'maxBoosted',
]

const HEADER_CLASS =
  'pb-2 text-right align-bottom text-xs font-semibold leading-4 text-primary-1 desktop:border-b desktop:border-solid desktop:border-primary-3 desktop:text-left desktop:text-sm desktop:leading-5'

const HEADER_LINE_CLASS =
  'relative mobile:after:absolute mobile:after:bottom-0 mobile:after:left-3 mobile:after:border-b mobile:after:border-solid mobile:after:border-primary-3'

const NUMBER_CLASS = 'text-xs font-bold text-primary-1 desktop:text-sm'

const BOOSTED_NUMBER_CLASS =
  'text-sm font-extrabold text-primary-1 desktop:text-base'

const EXTREME_MARK = {
  max: { symbol: '▲', label: '(최고)', barClass: 'bg-type-grass' },
  min: { symbol: '▼', label: '(최저)', barClass: 'bg-damage-physical' },
} as const

const DetailRealStatTable = ({
  stats,
  replayKey,
}: DetailRealStatTableProps) => {
  const legendId = useId()
  const progress = useReplayProgress(replayKey)

  const table = getRealStatTable(stats)
  const barMax = getRealStatBarMax(table)
  const extremes = {
    noInvestment: getRealStatColumnExtremes(table, 'noInvestment'),
    maxInvestment: getRealStatColumnExtremes(table, 'maxInvestment'),
    maxBoosted: getRealStatColumnExtremes(table, 'maxBoosted'),
  }
  const barReplayClass =
    replayKey === 0 ? '' : 'motion-safe:animate-bar-slide-in'

  const getExtremeMark = (column: RealStatColumn, value: number) => {
    const { max, min } = extremes[column]
    if (value === max) return EXTREME_MARK.max
    if (value === min && min !== max) return EXTREME_MARK.min
    return null
  }

  return (
    <div className="w-full">
      <table
        aria-describedby={legendId}
        className="-my-1 w-full table-fixed border-separate border-spacing-y-1"
      >
        <caption className="sr-only">Lv50 실수치</caption>
        <colgroup>
          <col className="w-16" />
          <col className="mobile:w-16" />
          <col className="mobile:w-16" />
          <col className="mobile:w-28" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className={HEADER_CLASS}>
              <span className="sr-only">능력치</span>
            </th>
            <th
              scope="col"
              className={`${HEADER_CLASS} ${HEADER_LINE_CLASS} mobile:after:right-0`}
            >
              무투자
            </th>
            <th
              scope="col"
              className={`${HEADER_CLASS} ${HEADER_LINE_CLASS} mobile:after:right-0`}
            >
              최대 투자
            </th>
            <th
              scope="col"
              className={`${HEADER_CLASS} ${HEADER_LINE_CLASS} mobile:pr-8 mobile:after:right-8`}
            >
              최대 투자
              <br className="desktop:hidden" /> + 상승 성격
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, rowIndex) => (
            <tr key={row.key}>
              <th
                scope="row"
                className={`h-7 text-left align-middle text-xs font-semibold text-primary-2 desktop:h-8 ${
                  rowIndex === 0 ? 'pt-2' : ''
                }`}
              >
                {row.label}
              </th>
              {COLUMNS.map((column) => {
                const value = table[row.key][column]
                const isBoosted = column === 'maxBoosted'
                const extremeMark = getExtremeMark(column, value)
                const defaultBarClass = isBoosted
                  ? 'bg-primary-1'
                  : 'bg-primary-2'

                return (
                  <td
                    key={column}
                    className={`relative h-7 align-middle desktop:h-8 desktop:pr-8 ${
                      isBoosted ? 'pr-8' : ''
                    } ${rowIndex === 0 ? 'pt-2' : ''}`}
                  >
                    <div className="flex items-center justify-end desktop:justify-start desktop:gap-2">
                      <span className="flex items-center gap-0.5 desktop:w-14 desktop:shrink-0">
                        <StatBarAnimatedValue
                          value={value}
                          progress={progress}
                          className={
                            isBoosted ? BOOSTED_NUMBER_CLASS : NUMBER_CLASS
                          }
                        />
                        {extremeMark && (
                          <>
                            <span
                              aria-hidden="true"
                              className="order-first text-2xs text-primary-1 desktop:order-none"
                            >
                              {extremeMark.symbol}
                            </span>
                            <span className="sr-only">{extremeMark.label}</span>
                          </>
                        )}
                      </span>
                      <span
                        aria-hidden="true"
                        className="hidden h-2.5 flex-1 overflow-hidden rounded-full bg-primary-1/10 desktop:block"
                      >
                        <span
                          className={`block h-full rounded-full ${barReplayClass} ${extremeMark?.barClass ?? defaultBarClass}`}
                          style={{ width: `${(value / barMax) * 100}%` }}
                        />
                      </span>
                    </div>
                    {row.key === 'hp' && isBoosted && <DetailHpNatureTip />}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div
        id={legendId}
        className="mt-3 text-2xs leading-4 text-primary-1 desktop:flex desktop:flex-wrap desktop:items-center desktop:gap-x-4 desktop:text-xs"
      >
        <p className="font-semibold">Lv50 · 개체값 31 기준</p>
        <ul className="desktop:flex desktop:flex-wrap desktop:gap-x-4">
          <li>
            <span className="font-semibold">본편</span>: 최대 투자 = 노력치 252
          </li>
          <li>
            <span className="font-semibold">챔피언스</span>: 최대 투자 = 능력
            포인트 32
          </li>
          <li className="flex items-center gap-1">
            <span
              aria-hidden="true"
              className="hidden h-2.5 w-4 rounded-full bg-type-grass desktop:inline-block"
            />
            ▲ 최고
            <span
              aria-hidden="true"
              className="ml-2 hidden h-2.5 w-4 rounded-full bg-damage-physical desktop:inline-block"
            />
            <span className="ml-2 desktop:ml-0">▼ 최저</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default DetailRealStatTable
