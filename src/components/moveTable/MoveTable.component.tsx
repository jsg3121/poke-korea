import Link from 'next/link'

import { PokemonType } from '~/graphql/typeGenerated'
import Chip from '~/components/chip/Chip.component'
import { ChipColor } from '~/components/chip/chip.types'
import Tag from '~/components/tag/Tag.component'

export interface MoveTableItem {
  condition: string
  name: string
  type?: PokemonType | null
  damageClass: ChipColor
  power?: number | null
  accuracy?: number | null
  pp?: number | null
  href?: string
}

interface MoveTableProps {
  moves: MoveTableItem[]
  ariaLabel: string
}

const DAMAGE_LABEL: Record<ChipColor, string> = {
  physical: '물리',
  special: '특수',
  status: '변화',
}

const COL = {
  condition: 'desktop:w-20',
  type: 'desktop:w-14',
  damage: 'desktop:w-16',
  stat: 'desktop:w-12',
}

const MoveStat = ({
  label,
  value,
}: {
  label: string
  value?: number | null
}) => (
  <span
    className={`text-2xs text-primary-2 desktop:text-xs ${COL.stat} desktop:shrink-0 desktop:text-center`}
  >
    <span className="desktop:sr-only">{label} </span>
    <b className="text-xs font-bold text-primary-1 desktop:text-sm">
      {value ?? '-'}
    </b>
  </span>
)

const MoveTable = ({ moves, ariaLabel }: MoveTableProps) => {
  return (
    <div className="w-full">
      <div
        aria-hidden="true"
        className="hidden items-center gap-2 rounded-lg bg-primary-1/5 px-3 py-2 text-xs font-semibold text-primary-2 desktop:flex"
      >
        <span className={`${COL.condition} shrink-0 text-center`}>습득</span>
        <span className="flex-1">기술명</span>
        <span className={`${COL.type} shrink-0 text-center`}>타입</span>
        <span className={`${COL.damage} shrink-0 text-center`}>분류</span>
        <span className={`${COL.stat} shrink-0 text-center`}>위력</span>
        <span className={`${COL.stat} shrink-0 text-center`}>명중</span>
        <span className={`${COL.stat} shrink-0 text-center`}>PP</span>
      </div>
      <ul aria-label={ariaLabel}>
        {moves.map((move, index) => (
          <li
            key={`${move.name}-${move.condition}-${index}`}
            className={`relative border-b border-solid border-primary-2 py-2 last:border-b-0 desktop:flex desktop:items-center desktop:gap-2 desktop:px-3 desktop:py-2.5 ${
              move.href
                ? 'rounded-lg transition-colors hover:bg-primary-1/5'
                : ''
            }`}
          >
            {move.href && (
              <Link
                href={move.href}
                aria-label={`${move.name} 상세 정보`}
                className="absolute inset-0 z-10 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-1"
              />
            )}
            <div className="flex flex-nowrap items-center gap-2 desktop:contents">
              <span
                className={`min-w-10 shrink-0 whitespace-nowrap rounded-lg bg-primary-1/10 px-2 py-0.5 text-center text-2xs font-bold text-primary-2 ${COL.condition}`}
              >
                {move.condition}
              </span>
              <span className="min-w-0 flex-1 break-keep text-xs font-bold text-primary-1 desktop:text-sm">
                {move.name}
              </span>
              <span
                className={`inline-flex shrink-0 ${COL.type} desktop:justify-center`}
              >
                {move.type && <Tag type={move.type} />}
              </span>
              <span
                className={`inline-flex shrink-0 ${COL.damage} desktop:justify-center`}
              >
                <Chip
                  label={DAMAGE_LABEL[move.damageClass]}
                  color={move.damageClass}
                />
              </span>
            </div>
            <div className="mt-1 flex items-center gap-4 desktop:contents">
              <MoveStat label="위력" value={move.power} />
              <MoveStat label="명중" value={move.accuracy} />
              <MoveStat label="PP" value={move.pp} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MoveTable
