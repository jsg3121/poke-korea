import { ReactNode } from 'react'

interface SectionHeadingComponentProps {
  children: ReactNode
  /** aria-labelledby 연결용 id (섹션 landmark와 매칭) */
  id?: string
}

/**
 * 섹션 제목 타이포그래피 컴포넌트 (반응형 단일, 모바일 퍼스트).
 * 여백·sticky 등 레이아웃은 부모가 책임진다 (className prop 미제공으로 캡슐화 유지).
 *
 * 모바일은 text-2xl(24px) — 좁은 폭(340px대)에서 30px는 과대해 제목이 화면을
 * 압도하고 긴 제목("이번 주 챔피언스 TOP 3")이 줄바꿈된다(사용자 피드백 2026-07-06).
 * 데스크톱은 기존 text-4xl 유지.
 */
const SectionHeadingComponent = ({
  children,
  id,
}: SectionHeadingComponentProps) => {
  return (
    <h2
      id={id}
      className="h-9 text-2xl desktop:h-12 desktop:text-4xl font-bold text-primary-4 text-center"
    >
      {children}
    </h2>
  )
}

export default SectionHeadingComponent
