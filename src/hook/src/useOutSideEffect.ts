import { useEffect } from 'react'

type UseOutSideEffect = (
  ref: React.RefObject<HTMLElement>,
  onOutSideClick: () => void
) => void

const useOutsideEffect: UseOutSideEffect = (ref, onOutsideClick) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutsideClick()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, onOutsideClick])
}

export default useOutsideEffect
