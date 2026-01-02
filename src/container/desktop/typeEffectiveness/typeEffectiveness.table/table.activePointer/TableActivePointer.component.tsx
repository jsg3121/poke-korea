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
    <div className="h-8 flex-items-gap-2 float-right">
      <button
        type="button"
        data-effective="double"
        className={`h-8 text-base text-aligned-base text-primary-3 flex items-baseline cursor-pointer hover:text-primary-4 ${
          activeType === 'double' ? 'text-primary-4' : ''
        }`}
        aria-pressed={activeType === 'double'}
        onClick={handleClickPointer}
      >
        2배만 보기
      </button>
      <button
        type="button"
        data-effective="half"
        className={`h-8 text-base text-aligned-base text-primary-3 flex items-baseline cursor-pointer hover:text-primary-4 ${
          activeType === 'half' ? 'text-primary-4' : ''
        }`}
        aria-pressed={activeType === 'half'}
        onClick={handleClickPointer}
      >
        0.5배만 보기
      </button>
      <button
        type="button"
        data-effective="zero"
        className={`h-8 text-base text-aligned-base text-primary-3 flex items-baseline cursor-pointer hover:text-primary-4 ${
          activeType === 'zero' ? 'text-primary-4' : ''
        }`}
        aria-pressed={activeType === 'zero'}
        onClick={handleClickPointer}
      >
        0배만 보기
      </button>
      <button
        type="button"
        className="w-4 h-4 [&>svg]:fill-primary-3 hover:[&>svg]:fill-primary-4"
        aria-label="초기화"
        onClick={handleClickResetEffective}
      >
        <ResetIcon width="1rem" height="1rem" alt="선택 배율 초기화" />
      </button>
    </div>
  )
}

export default TableActivePointerComponent
