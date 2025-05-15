import { MouseEvent } from 'react'
import styled from 'styled-components'
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
    <Div>
      <button
        type="button"
        data-effective="double"
        className={activeType === 'double' ? 'active-pointer' : ''}
        aria-pressed={activeType === 'double'}
        onClick={handleClickPointer}
      >
        2배만 보기
      </button>
      <button
        type="button"
        data-effective="half"
        className={activeType === 'half' ? 'active-pointer' : ''}
        aria-pressed={activeType === 'half'}
        onClick={handleClickPointer}
      >
        0.5배만 보기
      </button>
      <button
        type="button"
        data-effective="zero"
        className={activeType === 'zero' ? 'active-pointer' : ''}
        aria-pressed={activeType === 'zero'}
        onClick={handleClickPointer}
      >
        0배만 보기
      </button>
      <button
        type="button"
        className="button-reset"
        aria-label="초기화"
        onClick={handleClickResetEffective}
      >
        <ResetIcon width="1rem" height="1rem" alt="선택 배율 초기화" />
      </button>
    </Div>
  )
}

export default TableActivePointerComponent

const Div = styled.div`
  height: 16.5rem;
  height: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  float: right;

  & > button {
    height: 2rem;
    font-size: 1rem;
    line-height: calc(2rem + 2px);
    color: var(--color-primary-3);
    display: flex;
    align-items: baseline;
    cursor: pointer;

    &:hover,
    &.active-pointer {
      color: var(--color-primary-4);
    }

    &.button-reset {
      width: 1rem;
      height: 1rem;

      svg {
        fill: var(--color-primary-3);
      }

      &:hover {
        svg {
          fill: var(--color-primary-4);
        }
      }
    }
  }
`
