import { MouseEvent } from 'react'

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
    <div className="h-8 flex-items-gap-2 text-white">
      <button
        type="button"
        data-effective="double"
        className={`h-8 min-w-12 text-base text-aligned-base px-4 rounded-full tracking-[-0.2px] cursor-pointer ${
          activeType === 'double'
            ? 'text-primary-1 bg-primary-4'
            : 'text-primary-1 bg-primary-3'
        }`}
        aria-pressed={activeType === 'double'}
        onClick={handleClickPointer}
      >
        2배 보기
      </button>
      <button
        type="button"
        data-effective="half"
        className={`h-8 min-w-12 text-base text-aligned-base px-4 rounded-full tracking-[-0.2px] cursor-pointer ${
          activeType === 'half'
            ? 'text-primary-1 bg-primary-4'
            : 'text-primary-1 bg-primary-3'
        }`}
        aria-pressed={activeType === 'half'}
        onClick={handleClickPointer}
      >
        0.5배 보기
      </button>
      <button
        type="button"
        data-effective="zero"
        className={`h-8 min-w-12 text-base text-aligned-base px-4 rounded-full tracking-[-0.2px] cursor-pointer ${
          activeType === 'zero'
            ? 'text-primary-1 bg-primary-4'
            : 'text-primary-1 bg-primary-3'
        }`}
        aria-pressed={activeType === 'zero'}
        onClick={handleClickPointer}
      >
        0배 보기
      </button>
      <button
        type="button"
        aria-label="초기화"
        className={`h-8 min-w-12 text-base text-aligned-base px-4 rounded-full tracking-[-0.2px] cursor-pointer text-primary-1 bg-primary-3`}
        onClick={handleClickResetEffective}
      >
        초기화
      </button>
    </div>
  )
}

export default TableActivePointerComponent
