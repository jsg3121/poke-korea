/**
 * 페이지 헤더 (DS 원자). 페이지 상단의 제목 + 설명 영역.
 *
 * 데/모 2벌(components/PageHeader, components/mobile/PageHeader)을 CSS 반응형 단일로
 * 통합한다(ADR-0007, UA 분기·display:none 없음). 모바일 퍼스트로 base가 모바일, desktop:로
 * 확장한다. 색·폰트는 등록된 토큰만 사용한다(임의값 제거).
 *
 * 좌우 gutter는 컴포넌트가 주지 않고 부모(페이지)가 준다(DS 일관성) — w-full.
 */

interface PageHeaderProps {
  title: string
  description: string
}

const PageHeaderComponent = ({ title, description }: PageHeaderProps) => {
  return (
    <header className="w-full text-center border-b border-solid border-primary-4 pt-4 pb-2 mb-6 desktop:mb-8">
      <h1 className="text-3xl desktop:text-4xl font-bold leading-tight text-primary-4">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl mx-auto text-sm desktop:text-base text-primary-3 whitespace-break-spaces">
        {description}
      </p>
    </header>
  )
}

export default PageHeaderComponent
