'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

/**
 * 버전(등장 버전) 선택 가로 스크롤 nav.
 *
 * ADR-0010에 따라 detail/moves 컨테이너 로컬에서 `src/components/moves/`로 승격
 * (UX-008) — 기술 상세(/moves/[id])가 동일 패턴(버전별 URL 링크 나열)을 재사용하면서
 * 사용처가 2곳이 됐다. "최신" 같은 특수 항목은 호출부가 items 맨 앞에 prepend한다
 * (컴포넌트는 항목 의미를 모른다).
 *
 * 각 버전은 별도 URL(path 기반)이라 항목은 링크(next/link)다 — Chip(clickable=button,
 * onClick만) 원자로는 커버되지 않아 시각 토큰만 Chip과 정합시켜 로컬 구현한다.
 * 가로 스크롤 1줄 + active 자동 스크롤 인. 라벨 텍스트는 두지 않고(피드백), nav의
 * aria-label로 의미를 남긴다.
 */

export interface MovesVersionNavItem {
  versionGroupId: number
  /** 표시 라벨 (예: '스칼렛·바이올렛') */
  label: string
  /** 이 버전으로 가는 URL (경로 규칙은 호출부 책임) */
  href: string
  /** 현재 선택된 버전 */
  active: boolean
}

interface MovesVersionNavProps {
  items: MovesVersionNavItem[]
}

const MovesVersionNavComponent = ({ items }: MovesVersionNavProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  // 최초 마운트 시 활성 버전이 보이도록 스크롤(모바일에서 뒤쪽 버전이 선택됐을 때)
  useEffect(() => {
    const active = scrollRef.current?.querySelector('[data-active="true"]')
    active?.scrollIntoView({
      inline: 'start',
      block: 'nearest',
      behavior: 'smooth',
    })
  }, [])

  return (
    <nav aria-label="등장 버전 선택" className="py-2.5">
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto px-4 py-0.5 desktop:px-0 [&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-thumb]:bg-primary-2 [&::-webkit-scrollbar-track]:rounded-xl [&::-webkit-scrollbar-track]:bg-primary-3/40"
        >
          {items.map((item) => (
            <Link
              key={item.versionGroupId}
              href={item.href}
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
        {/* 가로 스크롤 단서: 우측 페이드(iOS 스크롤바 미표시 대비, RES-003) */}
        {/* to-transparent은 Safari에서 회색 잔상 — 동색 투명(to-primary-1/0)으로
            보간해야 깔끔(CSS Images 3 premultiplied 보간, Gemini) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-primary-1 to-primary-1/0"
        />
      </div>
    </nav>
  )
}

export default MovesVersionNavComponent
