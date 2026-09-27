'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import Link from 'next/link'

// useLayoutEffect는 SSR에서 경고를 낸다. 서버에선 아무것도 하지 않는 useEffect로
// 대체한다 — CSR 전용으로 돌리면 초기 HTML에서 내부 링크가 빠진다.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

export interface MovesVersionNavItem {
  versionGroupId: number
  label: string
  href: string
  active: boolean
}

interface MovesVersionNavProps {
  items: MovesVersionNavItem[]
  scroll?: boolean
  storageKey?: string
}

const SCROLL_STORAGE_PREFIX = 'moves-version-nav-scroll'

const MovesVersionNav = ({
  items,
  scroll,
  storageKey,
}: MovesVersionNavProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    const list = scrollRef.current
    const active = list?.querySelector<HTMLElement>('[data-active="true"]')
    if (!list || !active) return

    const key = storageKey
      ? `${SCROLL_STORAGE_PREFIX}:${storageKey}`
      : undefined

    if (key) {
      const saved = Number(sessionStorage.getItem(key))
      if (Number.isFinite(saved) && saved > 0) list.scrollLeft = saved
    }

    const left = active.offsetLeft - list.offsetLeft
    const right = left + active.offsetWidth
    const isVisible =
      left >= list.scrollLeft && right <= list.scrollLeft + list.clientWidth

    // 동작 줄이기 설정을 켠 사용자에겐 'auto'로 낮춘다 — 옆으로 미끄러지는 움직임은
    // 전정 장애 사용자에게 어지럼증을 유발할 수 있다(WCAG 2.1 SC 2.3.3).
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (!isVisible) {
      active.scrollIntoView({
        inline: 'start',
        block: 'nearest',
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      })
    }

    if (!key) return

    const save = () => sessionStorage.setItem(key, String(list.scrollLeft))
    list.addEventListener('scroll', save, { passive: true })

    return () => {
      list.removeEventListener('scroll', save)
    }
  }, [storageKey])

  return (
    <nav aria-label="등장 버전 선택" className="py-2.5">
      <div className="relative">
        <div
          ref={scrollRef}
          // overflow-y-hidden 필수: overflow-x만 auto면 CSS 명세상 overflow-y도
          // auto로 강제 계산돼 미세한 세로 오버플로에도 Y축 스크롤이 잡힌다.
          className="flex gap-3 scroll-pl-4 overflow-x-auto overflow-y-hidden px-4 py-0.5 desktop:scroll-pl-0 desktop:px-0 [&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-thumb]:bg-primary-2 [&::-webkit-scrollbar-track]:rounded-xl [&::-webkit-scrollbar-track]:bg-primary-3/40"
        >
          {items.map((item) => (
            <Link
              key={item.versionGroupId}
              href={item.href}
              scroll={scroll}
              data-active={item.active}
              aria-current={item.active ? 'page' : undefined}
              className={`inline-block h-6 shrink-0 whitespace-nowrap rounded-lg px-2.5 text-xs text-aligned-sm font-medium transition-all desktop:h-7 desktop:px-3 desktop:text-sm desktop:text-aligned-md ${
                item.active
                  ? 'scale-105 bg-primary-1 text-primary-4'
                  : 'bg-primary-3 text-primary-1 opacity-60 hover:opacity-100 focus-visible:opacity-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-primary-1 to-primary-1/0"
        />
      </div>
    </nav>
  )
}

export default MovesVersionNav
