'use client'

import { MouseEvent } from 'react'

import ResetIcon from '~/assets/icons/button-reset.svg'

export type ActivePointerType = 'double' | 'half' | 'zero' | undefined

const POINTER_OPTIONS: Array<{
  value: Exclude<ActivePointerType, undefined>
  label: string
}> = [
  { value: 'double', label: '2배만 보기' },
  { value: 'half', label: '0.5배만 보기' },
  { value: 'zero', label: '0배만 보기' },
]

interface TableActivePointerProps {
  activeType?: Exclude<ActivePointerType, undefined>
  onClickPointer: (activeType: ActivePointerType) => void
  onClickResetEffective: () => void
}

const TableActivePointer = ({
  activeType,
  onClickPointer,
  onClickResetEffective,
}: TableActivePointerProps) => {
  const handleClickPointer = (e: MouseEvent<HTMLButtonElement>) => {
    const effectiveType = e.currentTarget.dataset.effective as ActivePointerType
    onClickPointer(effectiveType)
  }

  return (
    <div
      role="group"
      aria-label="배율별 강조 필터"
      className="flex flex-wrap items-center gap-2"
    >
      {POINTER_OPTIONS.map(({ value, label }) => {
        const active = activeType === value
        return (
          <button
            key={`pointer-${value}`}
            type="button"
            data-effective={value}
            aria-pressed={active}
            onClick={handleClickPointer}
            className={`min-h-8 rounded-full border border-solid px-3 text-xs font-medium transition-colors desktop:min-h-9 desktop:text-sm ${
              active
                ? 'border-primary-4 bg-primary-4 text-primary-1'
                : 'border-primary-3 bg-transparent text-primary-3 hover:border-primary-4 hover:text-primary-4'
            }`}
          >
            {label}
          </button>
        )
      })}
      <button
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full [&>svg]:fill-primary-3 hover:[&>svg]:fill-primary-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-4 desktop:h-9 desktop:w-9"
        aria-label="배율 필터 초기화"
        disabled={!activeType}
        onClick={onClickResetEffective}
      >
        <ResetIcon width="1rem" height="1rem" aria-hidden="true" />
      </button>
    </div>
  )
}

export default TableActivePointer
