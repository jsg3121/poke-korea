import { useEffect } from 'react'

type UseOutSideClickOptions = {
  ref: React.RefObject<HTMLElement>
  onOutsideClick: () => void
  isActive: boolean
}

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
