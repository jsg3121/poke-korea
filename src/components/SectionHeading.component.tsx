import { ReactNode } from 'react'

interface SectionHeadingComponentProps {
  children: ReactNode
  /** aria-labelledby 연결용 id (섹션 landmark와 매칭) */
  id?: string
}

/**
 * 섹션 제목 타이포그래피 컴포넌트 (반응형 단일, 모바일 퍼스트).
 * 여백·sticky 등 레이아웃은 부모가 책임진다 (className prop 미제공으로 캡슐화 유지).
 */
const SectionHeadingComponent = ({
  children,
  id,
}: SectionHeadingComponentProps) => {
  return (
    <h2
      id={id}
      className="h-12 text-3xl desktop:text-4xl font-bold text-primary-4 text-center"
    >
      {children}
    </h2>
  )
}

export default SectionHeadingComponent
