import React from 'react'

type UseBodyScrollLockFn = (isLock: boolean) => void

/**
 * @desc 팝업 등이 열리는 경우 백그라운드의 스크롤을 막도록 합니다
 * @param isLock 스크롤 잠김 여부
 */
export const useBodyScrollLock: UseBodyScrollLockFn = (isLock) => {
  React.useEffect(() => {
    if (isLock) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isLock])
}
