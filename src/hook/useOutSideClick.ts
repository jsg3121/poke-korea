import { useEffect } from 'react'

type UseOutSideClickOptions = {
  ref: React.RefObject<HTMLElement>
  onOutsideClick: () => void
  isActive: boolean
}

/**
 * @desc 검색 결과에 따라 리스트를 표시한 뒤 다른 영역을 클릭하거나 esc, tab 키를 입력시 리스트를 닫도록 합니다.
 *
 */
export const useOutSideClick = ({
  ref,
  onOutsideClick,
  isActive,
}: UseOutSideClickOptions) => {
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (isActive && ref.current && !ref.current.contains(e.target as Node)) {
        onOutsideClick()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isActive && (e.code === 'Escape' || e.code === 'Tab')) {
        onOutsideClick()
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isActive, onOutsideClick, ref])
}
