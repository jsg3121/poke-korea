'use client'

import {
  Children,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

/**
 * 자식 요소(주로 PokemonCard)를 가로 스크롤로 배치하는 DS 래퍼 (신규).
 * 기존 Banner/Champions의 가로 스크롤 마크업을 추출하지 않고, 토큰 기반으로
 * 규격화해 새로 만든다.
 *
 * - 자식 간격은 모바일 퍼스트 토큰: 모바일 gap-4(16px) → desktop:gap-6(24px).
 *   PokemonCard의 흰 테두리는 box-shadow(spread 0.25rem)로 레이아웃 밖에 그려져
 *   양쪽에서 gap을 ~8px 잠식하므로, 시각적 간격을 확보하려면 gap을 그만큼 더 준다.
 * - 패딩은 모바일 p-2(8px) → desktop:p-4(16px).
 * - 가로 스크롤 단서(M1): 카드가 고정 폭이므로 컨테이너가 좁으면
 *   다음 카드가 자연히 살짝 보이는(peek) 구조 → 별도 calc 불필요.
 * - **엣지 페이드(보조 단서)**: iOS Safari는 ::-webkit-scrollbar 커스텀을 지원하지
 *   않고 인디케이터가 스크롤 중에만 잠깐 표시돼, 정지 상태에선 스크롤 가능 여부를
 *   알 수 없다 → 스크롤 여지가 있는 쪽에 그라데이션 오버레이를 띄우고, 끝에
 *   도달하면 사라지게 한다. inset box-shadow 방식은 자식 카드가 위에 그려져
 *   가려지므로 오버레이로 구현한다.
 * - 호버 scale 여유: 카드가 hover로 커질 때(scale-105) 사방으로 넘쳐 Y축
 *   스크롤이 생기거나 양 끝 카드가 잘리지 않도록 사방 패딩을 주고
 *   Y축 오버플로를 숨긴다.
 * - 스크롤바: showScrollbar로 표시/숨김. 색상은 기존 무드(primary-2/3) 유지,
 *   두께는 표준 토큰 h-1(4px)로 규격화. (iOS에선 플랫폼 특성상 미표시)
 */

interface HorizontalScrollListProps {
  children: ReactNode
  /** 스크롤바 표시 여부 (기본 true) */
  showScrollbar?: boolean
  /** 스크롤 영역 접근명 (예: "오늘의 포켓몬 목록") */
  'aria-label'?: string
}

/** 스크롤바 표시 스타일 (기존 무드 유지: primary-2 thumb / primary-3 track, 두께 h-1) */
const SCROLLBAR_VISIBLE =
  '[&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-primary-2 [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-track]:bg-primary-3 [&::-webkit-scrollbar-track]:rounded-xl'

/** 스크롤바 숨김 스타일 (스크롤은 가능, 바만 비표시) */
const SCROLLBAR_HIDDEN = '[&::-webkit-scrollbar]:hidden [scrollbar-width:none]'

/**
 * 엣지 페이드 공통 (표시/숨김은 opacity 토글 — transition으로 부드럽게).
 * 색은 black-2 70% 딤 — 배경(primary-1)과 동색은 배경 틈에서 안 보이고, 밝은
 * 글로우는 파스텔 카드 위에서 존재감이 약해, 실기기 확인으로 확정한 값(2026-07-06).
 */
const FADE_BASE =
  'pointer-events-none absolute inset-y-0 w-6 transition-opacity duration-300'

const HorizontalScrollListComponent = ({
  children,
  showScrollbar = true,
  'aria-label': ariaLabel,
}: HorizontalScrollListProps) => {
  const listRef = useRef<HTMLUListElement>(null)
  const [showStartFade, setShowStartFade] = useState(false)
  const [showEndFade, setShowEndFade] = useState(false)

  // 스크롤 위치로 양끝 페이드 표시를 갱신한다 (1px 여유로 서브픽셀 오차 흡수)
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
    // 뷰포트 회전/리사이즈로 넘침 여부가 바뀔 수 있어 컨테이너 크기를 관찰한다
    const observer = new ResizeObserver(updateFades)
    observer.observe(list)
    return () => observer.disconnect()
  }, [updateFades])

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
        {/* 가로 목록 시맨틱 보장: 각 자식을 li로 래핑(자식은 shrink 방지로 고정 폭 유지) */}
        {Children.map(children, (child, index) => (
          <li key={index} className="flex-shrink-0">
            {child}
          </li>
        ))}
      </ul>

      {/* 엣지 페이드 — 해당 방향에 스크롤 여지가 있을 때만 표시, 끝 도달 시 사라짐 */}
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

export default HorizontalScrollListComponent
