import { MouseEvent } from 'react'
import ResetIcon from '~/assets/icons/button-reset.svg'

export type ActivePointerType = 'double' | 'half' | 'zero' | undefined

interface TableActivePointerComponentProps {
  activeType?: 'double' | 'half' | 'zero'
  onClickPointer: (activeType: ActivePointerType) => void
  onClickResetEffective: () => void
}

const TableActivePointerComponent = ({
  activeType,
  onClickPointer,
  onClickResetEffective,
}: TableActivePointerComponentProps) => {
  const handleClickPointer = (e: MouseEvent<HTMLButtonElement>) => {
    const effectiveType = e.currentTarget.dataset.effective as ActivePointerType
    onClickPointer(effectiveType)
  }

  const handleClickResetEffective = () => {
    onClickResetEffective()
  }

  return (
    <div className="h-8 flex items-center gap-1 absolute right-0 text-white">
      <button
        type="button"
        data-effective="double"
        className={`h-4 text-sm leading-[calc(1rem+2px)] tracking-[-0.2px] flex items-baseline cursor-pointer ${
          activeType === 'double' ? 'text-primary-4' : 'text-primary-3'
        }`}
        aria-pressed={activeType === 'double'}
        onClick={handleClickPointer}
      >
        2배 보기
      </button>
      <button
        type="button"
        data-effective="half"
        className={`h-4 text-sm leading-[calc(1rem+2px)] tracking-[-0.2px] flex items-baseline cursor-pointer ${
          activeType === 'half' ? 'text-primary-4' : 'text-primary-3'
        }`}
        aria-pressed={activeType === 'half'}
        onClick={handleClickPointer}
      >
        0.5배 보기
      </button>
      <button
        type="button"
        data-effective="zero"
        className={`h-4 text-sm leading-[calc(1rem+2px)] tracking-[-0.2px] flex items-baseline cursor-pointer ${
          activeType === 'zero' ? 'text-primary-4' : 'text-primary-3'
        }`}
        aria-pressed={activeType === 'zero'}
        onClick={handleClickPointer}
      >
        0배 보기
      </button>
      <button
        type="button"
        className="w-3.5 h-3.5 cursor-pointer"
        aria-label="초기화"
        onClick={handleClickResetEffective}
      >
        <ResetIcon
          width="0.875rem"
          height="0.875rem"
          alt="선택 배율 초기화"
          className="fill-primary-3"
        />
      </button>
    </div>
  )
}

export default TableActivePointerComponent
