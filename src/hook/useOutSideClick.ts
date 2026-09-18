import { useEffect } from 'react'

type UseOutSideClickOptions = {
  ref: React.RefObject<HTMLElement>
  onOutsideClick: () => void
  isActive: boolean
}

/**
 * 활성 상태인 요소 바깥에서 포인터 입력이 발생하거나 Esc·Tab 키를 누르면 닫는다.
 *
 * @remarks
 * - `touchstart`와 `mousedown`을 함께 구독한다 — 터치 기기는 탭 한 번에 두 이벤트가
 *   순차 발생하지만, 첫 호출로 `isActive`가 내려가면 뒤따르는 합성 이벤트는 걸러진다.
 *   `mousedown`만 구독하면 터치 기기에서 닫힘이 지연되거나 누락된다.
 */
export const useOutSideClick = ({
  ref,
  onOutsideClick,
  isActive,
}: UseOutSideClickOptions) => {
  useEffect(() => {
    if (!isActive) {
      return
    }

    const handlePointerDown = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOutsideClick()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || e.code === 'Tab') {
        onOutsideClick()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isActive, onOutsideClick, ref])
}
