'use client'

import {
  Children,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

interface HorizontalScrollListProps {
  children: ReactNode
  showScrollbar?: boolean
  'aria-label'?: string
}

const SCROLLBAR_VISIBLE =
  '[&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-primary-2 [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-track]:bg-primary-3 [&::-webkit-scrollbar-track]:rounded-xl'

const SCROLLBAR_HIDDEN = '[&::-webkit-scrollbar]:hidden [scrollbar-width:none]'

const FADE_BASE =
  'pointer-events-none absolute inset-y-0 w-6 transition-opacity duration-300'

const HorizontalScrollList = ({
  children,
  showScrollbar = true,
  'aria-label': ariaLabel,
}: HorizontalScrollListProps) => {
  const listRef = useRef<HTMLUListElement>(null)
  const [showStartFade, setShowStartFade] = useState(false)
  const [showEndFade, setShowEndFade] = useState(false)

  const updateFades = useCallback(() => {
    const list = listRef.current
    if (!list) return
    const { scrollLeft, scrollWidth, clientWidth } = list
    setShowStartFade(scrollLeft > 1)
    setShowEndFade(scrollLeft + clientWidth < scrollWidth - 1)
  }, [])

  useEffect(() => {
    updateFades()
    const list = listRef.current
    if (!list) return
    const observer = new ResizeObserver(updateFades)
    observer.observe(list)
    return () => observer.disconnect()
  }, [updateFades, children])

  return (
    <div className="relative">
      <ul
        ref={listRef}
        onScroll={updateFades}
        className={`w-full flex items-center gap-4 desktop:gap-6 p-2 desktop:p-4 overflow-x-auto overflow-y-hidden ${
          showScrollbar ? SCROLLBAR_VISIBLE : SCROLLBAR_HIDDEN
        }`}
        aria-label={ariaLabel}
      >
        {Children.map(children, (child, index) => (
          <li key={index} className="flex-shrink-0 w-[163.5px] desktop:w-auto">
            {child}
          </li>
        ))}
      </ul>

      <div
        aria-hidden="true"
        className={`${FADE_BASE} left-0 bg-gradient-to-r from-black-2/70 to-transparent ${
          showStartFade ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        aria-hidden="true"
        className={`${FADE_BASE} right-0 bg-gradient-to-l from-black-2/70 to-transparent ${
          showEndFade ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}

export default HorizontalScrollList
