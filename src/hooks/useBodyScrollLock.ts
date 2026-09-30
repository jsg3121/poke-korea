import { useEffect } from 'react'

type UseBodyScrollLockFn = (isLock: boolean) => void

/**
 * 팝업이 열린 동안 배경 스크롤을 막는다.
 * @param isLock 스크롤 잠김 여부
 */
export const useBodyScrollLock: UseBodyScrollLockFn = (isLock) => {
  useEffect(() => {
    if (isLock) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isLock])
}
