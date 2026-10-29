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
  'relative text-right align-baseline text-lg font-normal leading-7 desktop:border-b desktop:border-solid desktop:border-primary-3 desktop:text-left desktop:text-xl'

const HEADER_LINE_CLASS =
  'block border-b border-solid pb-3 desktop:border-0 desktop:pb-0'

const HEADER_TEXT_CLASS = 'text-xs font-semibold text-primary-2 desktop:text-sm'

const NUMBER_CLASS = 'text-xs font-bold text-primary-1 desktop:text-sm'

const BOOSTED_NUMBER_CLASS =
  'text-sm font-extrabold text-primary-1 desktop:text-base'

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

  const getBarColorClass = (column: RealStatColumn, value: number) => {
    const { max, min } = extremes[column]
    if (value === max) return 'bg-type-grass'
    if (value === min && min !== max) return 'bg-damage-physical'
    return column === 'maxBoosted' ? 'bg-primary-1' : 'bg-primary-2'
  }

  const getExtremeLabel = (column: RealStatColumn, value: number) => {
    const { max, min } = extremes[column]
    if (value === max) return '(최고)'
    if (value === min && min !== max) return '(최저)'
    return ''
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
              <span className={`${HEADER_LINE_CLASS} border-transparent`}>
                <span className="sr-only">능력치</span>
              </span>
            </th>
            <th scope="col" className={`${HEADER_CLASS} mobile:pl-3`}>
              <span className={`${HEADER_LINE_CLASS} border-primary-3`}>
                <span className={HEADER_TEXT_CLASS}>무투자</span>
              </span>
            </th>
            <th scope="col" className={`${HEADER_CLASS} mobile:pl-3`}>
              <span className={`${HEADER_LINE_CLASS} border-primary-3`}>
                <span className={HEADER_TEXT_CLASS}>최대 투자</span>
              </span>
            </th>
            <th
              scope="col"
              className={`${HEADER_CLASS} mobile:pl-3 mobile:pr-8`}
            >
              <span
                className={`${HEADER_TEXT_CLASS} mobile:absolute mobile:bottom-full mobile:right-8 mobile:leading-4`}
              >
                최대 투자
              </span>
              <span className={`${HEADER_LINE_CLASS} border-primary-3`}>
                <span className={HEADER_TEXT_CLASS}> + 상승 성격</span>
              </span>
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
                const extremeLabel = getExtremeLabel(column, value)

                return (
                  <td
                    key={column}
                    className={`relative h-7 align-middle desktop:h-8 desktop:pr-8 ${
                      isBoosted ? 'pr-8' : ''
                    } ${rowIndex === 0 ? 'pt-2' : ''}`}
                  >
                    <div className="text-right desktop:flex desktop:items-center desktop:gap-2 desktop:text-left">
                      <span className="desktop:w-11 desktop:shrink-0">
                        <StatBarAnimatedValue
                          value={value}
                          progress={progress}
                          className={
                            isBoosted ? BOOSTED_NUMBER_CLASS : NUMBER_CLASS
                          }
                        />
                        {extremeLabel !== '' && (
                          <span className="sr-only">{extremeLabel}</span>
                        )}
                      </span>
                      <span
                        aria-hidden="true"
                        className="hidden h-2.5 flex-1 overflow-hidden rounded-full bg-primary-1/10 desktop:block"
                      >
                        <span
                          className={`block h-full rounded-full ${barReplayClass} ${getBarColorClass(column, value)}`}
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
          <li className="hidden items-center gap-1 desktop:flex">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-4 rounded-full bg-type-grass"
            />
            최고
            <span
              aria-hidden="true"
              className="ml-2 inline-block h-2.5 w-4 rounded-full bg-damage-physical"
            />
            최저
          </li>
        </ul>
      </div>
    </div>
  )
}

export default DetailRealStatTable
