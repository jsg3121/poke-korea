'use client'

import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef } from 'react'

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

/**
 * useLayoutEffect는 서버에서 실행될 수 없어 SSR 시 React가 경고를 낸다. 스크롤
 * 복원은 클라이언트 전용 동작이라 서버에서는 아무것도 하지 않는 useEffect로
 * 대체해 경고만 피한다(동작 차이 없음 — 서버에선 둘 다 실행되지 않는다).
 *
 * 경고를 없애려고 이 nav를 CSR 전용으로 돌리는 선택은 하지 않는다. 칩은 버전별
 * 페이지로 가는 내부 링크(<Link>)라 초기 HTML에서 빠지면 크롤러가 따라갈 경로가
 * 사라지고, sticky 크롬 안에서 나중에 채워지며 레이아웃 시프트도 생긴다.
 */
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

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
  /**
   * 이동 시 스크롤을 맨 위로 올리지 않는다(기본값 true = 올림).
   *
   * 이 nav가 sticky 크롬 안에 있으면 이동할 때마다 최상단으로 튀어, 방금 누른
   * 버전 칩이 시야에서 사라진다. 그런 배치에서만 false로 준다.
   */
  scroll?: boolean
  /**
   * 가로 스크롤 위치를 보존할 때 쓰는 sessionStorage 키 구분자.
   *
   * 이 nav는 사용처가 2곳(포켓몬 습득 기술 / 기술 상세)이라 키를 나누지 않으면
   * 한쪽에서 민 위치를 다른 쪽이 물려받아 엉뚱한 곳으로 스크롤된다. 생략하면
   * 복원 없이 최초 1회 스크롤만 동작한다.
   */
  storageKey?: string
}

const SCROLL_STORAGE_PREFIX = 'moves-version-nav-scroll'

const MovesVersionNavComponent = ({
  items,
  scroll,
  storageKey,
}: MovesVersionNavProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  // 스크롤 위치를 이어붙인 뒤, 활성 버전이 시야 밖일 때만 앞쪽(왼쪽)에 정렬한다.
  //
  // 버전마다 URL이 달라 이동할 때마다 이 컴포넌트가 재마운트된다. 즉 매번 새 DOM
  // 노드에서 scrollLeft=0으로 시작하고 이 effect도 다시 실행된다 — 사용자가 보던
  // 스크롤 위치가 끊기는 근본 원인이다. 그래서 순서가 중요하다: 먼저 위치를
  // 복원(1)하고, 그 기준으로 가시성을 판정(2)한 뒤, 필요할 때만 보정(3)한다.
  //
  // 정렬은 scrollIntoView의 inline 값만으로는 원하는 동작이 안 나온다:
  // - 'start'  → 이미 보이는 칩도 매번 왼쪽 끝으로 끌어당겨 이동이 끊겨 보인다.
  // - 'nearest'→ 튐은 없지만 오른쪽에서 들어온 칩이 오른쪽 모서리에 붙어 멈춰,
  //              뒤에 남은 버전이 있는지 보이지 않는다.
  // 명세상 둘 중 하나만 고를 수 있으므로(CSSOM View §scroll-an-element-into-view),
  // "보이는가" 판정만 JS로 하고 실제 정렬·여백은 'start' + CSS scroll-padding에
  // 맡긴다. 여백을 JS 상수로 두면 모바일 px-4 / 데스크톱 px-0 차이를 여기서 다시
  // 계산해야 하는데, scroll-pl-4 desktop:scroll-pl-0이 그 일을 대신한다.
  //
  // 재마운트 자체를 없애는 방향(sticky nav를 layout으로 승격)은 ADR-0015에서
  // 검토 후 기각했다 — layout은 하위 세그먼트의 versionGroupId를 읽을 수 없어
  // 활성 상태의 SSR 반영이 깨진다.
  useIsomorphicLayoutEffect(() => {
    const list = scrollRef.current
    const active = list?.querySelector<HTMLElement>('[data-active="true"]')
    if (!list || !active) return

    const key = storageKey
      ? `${SCROLL_STORAGE_PREFIX}:${storageKey}`
      : undefined

    // 1) 이전 인스턴스가 남긴 위치를 먼저 되돌린다.
    //
    // 재마운트된 컨테이너의 scrollLeft는 항상 0이다 — 사용자가 손으로 밀어둔
    // 위치는 이전 DOM 노드와 함께 사라진다. 이걸 복원하지 않으면 아래 가시성
    // 판정이 "스크롤 0 기준"으로 이뤄져, 이미 보이던 칩도 시야 밖으로 오판되고
    // 스크롤이 매번 맨 앞에서 다시 출발해 이동이 끊겨 보인다.
    //
    // behavior 없이 대입해 즉시 반영한다(애니메이션 대상은 아래 보정뿐이다).
    if (key) {
      const saved = Number(sessionStorage.getItem(key))
      if (Number.isFinite(saved) && saved > 0) list.scrollLeft = saved
    }

    // 2) 복원된 위치 기준으로 활성 칩이 이미 보이는지 판정한다.
    //
    // offsetLeft는 스크롤과 무관한 콘텐츠 좌표라 scrollLeft와 직접 비교할 수 있다.
    // 컨테이너가 position:relative 래퍼 안이라 offsetParent가 래퍼일 수 있어
    // list.offsetLeft를 빼서 컨테이너 기준으로 보정한다.
    const left = active.offsetLeft - list.offsetLeft
    const right = left + active.offsetWidth
    const isVisible =
      left >= list.scrollLeft && right <= list.scrollLeft + list.clientWidth

    // 3) 시야 밖일 때만 앞쪽(왼쪽) 정렬. 여백은 CSS scroll-padding이 맡는다.
    //
    // behavior는 JS 옵션이라 CSS 미디어 쿼리가 끼어들 수 없어, 동작 줄이기(OS
    // 접근성 설정)를 켠 사용자에게도 그대로 애니메이션된다. 화면 폭만큼 콘텐츠가
    // 옆으로 미끄러지는 움직임은 전정 장애 사용자에게 어지럼증을 유발할 수 있어
    // (WCAG 2.1 SC 2.3.3), matchMedia로 직접 읽어 'auto'(즉시 이동)로 낮춘다.
    // 최종 스크롤 위치는 같고 이동 과정만 사라진다.
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

    // 4) 이후 스크롤(사용자 조작 + 위 보정 애니메이션)을 계속 기록해, 다음
    //    재마운트가 1)에서 되돌릴 위치를 남긴다.
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
          // visible→auto로 강제 계산돼, active 칩의 scale-105 확대(~1px) 같은
          // 미세한 세로 오버플로에도 Y축 스크롤이 잡힌다(핫픽스 2026-07-20).
          // 확대분은 py-0.5(2px)가 흡수하므로 클리핑은 없다.
          // scroll-pl-*: 위 effect의 inline:'start' 정렬 기준선을 좌측 패딩만큼
          // 안쪽으로 밀어, 칩이 모서리에 딱 붙지 않게 한다(px-4와 값을 맞춘다).
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
