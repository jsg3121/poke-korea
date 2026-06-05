'use client'

import { useState } from 'react'

/**
 * 대회 페이지 상단 BSS 안내 배너.
 *
 * Why: BSS 검색 유입 사용자에게 현재 VGC 대회만 노출되는 맥락을 즉시 전달.
 *      세션 내 닫기 가능 (sessionStorage 등 영속 저장은 단순화 위해 미사용).
 */
const ChampionsBssNotice = () => {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div
      role="status"
      className="flex items-center justify-between gap-3 bg-primary-2 border-l-4 border-amber-400 text-primary-4 text-sm px-4 py-3 rounded mb-4"
    >
      <span>현재 VGC 더블 대회 결과만 제공합니다.</span>
      <button
        type="button"
        onClick={() => setIsVisible(false)}
        aria-label="안내 배너 닫기"
        className="shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-primary-1/50 transition-colors"
      >
        ×
      </button>
    </div>
  )
}

export default ChampionsBssNotice
