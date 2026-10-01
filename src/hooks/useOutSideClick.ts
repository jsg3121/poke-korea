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

    const handleOutsideInteraction = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOutsideClick()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        onOutsideClick()
      }
    }

    document.addEventListener('mousedown', handleOutsideInteraction)
    document.addEventListener('touchstart', handleOutsideInteraction)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('focusin', handleOutsideInteraction)

    return () => {
      document.removeEventListener('mousedown', handleOutsideInteraction)
      document.removeEventListener('touchstart', handleOutsideInteraction)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('focusin', handleOutsideInteraction)
    }
  }, [isActive, onOutsideClick, ref])
}
