'use client'

import { useCallback, useId, useRef, useState } from 'react'

import { useOutSideClick } from '~/hooks/useOutSideClick'

const TIP_TEXT = '체력(HP)은 성격 보정을 받지 않아요'

const DetailHpNatureTip = () => {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLSpanElement>(null)
  const tipId = useId()

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  useOutSideClick({
    ref: rootRef,
    onOutsideClick: handleClose,
    isActive: isOpen,
  })

  const handleClickToggle = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <span
      ref={rootRef}
      className="absolute right-0 top-1/2 z-10 -translate-y-1/2"
    >
      <button
        type="button"
        aria-label="성격 보정 안내"
        aria-expanded={isOpen}
        aria-describedby={tipId}
        onClick={handleClickToggle}
        className="flex h-11 w-11 items-center justify-center rounded-full text-primary-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-1 desktop:h-8 desktop:w-8"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="8" cy="8" r="6.75" />
          <path d="M8 7.25v4" strokeLinecap="round" />
          <circle cx="8" cy="4.75" r="0.75" fill="currentColor" stroke="none" />
        </svg>
      </button>
      <span
        id={tipId}
        hidden={!isOpen}
        className="absolute right-0 top-full -mt-2 w-max desktop:mt-0 max-w-56 rounded-lg bg-primary-1 px-3 py-2 text-left text-xs font-medium text-primary-4"
      >
        {TIP_TEXT}
      </span>
    </span>
  )
}

export default DetailHpNatureTip
