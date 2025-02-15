import { useEffect } from 'react'

type UseOutSideClickMobileOptions = {
  ref: React.RefObject<HTMLElement>
  onOutsideClick: () => void
  isActive: boolean
}

/**
 * @desc 검색 결과에 따라 리스트를 표시한 뒤 다른 영역에서 마우스 이벤트가 발생했을 때 리스트를 닫도록 합니다.
 *
 */
export const useOutSideClickMobile = ({
  ref,
  onOutsideClick,
  isActive,
}: UseOutSideClickMobileOptions) => {
  useEffect(() => {
    const handleMoveEvent = (e: Event) => {
      if (isActive && ref.current && !ref.current.contains(e.target as Node)) {
        onOutsideClick()
      }
    }

    document.addEventListener('mousedown', handleMoveEvent)
    document.addEventListener('touchstart', handleMoveEvent)

    return () => {
      document.removeEventListener('mousedown', handleMoveEvent)
      document.removeEventListener('touchstart', handleMoveEvent)
    }
  }, [isActive, onOutsideClick, ref])
}
