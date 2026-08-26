/**
 * 상세 카드 제목 (기존 데/모 InfoCardTitle 이관 — 반응형 단일 컨테이너 전용).
 * 구버전 제거 시 container/desktop·mobile 쪽 원본도 함께 정리한다.
 */
interface InfoCardTitleComponentProps {
  title: string
  id?: string
  /** 제목 우측 배지(전설·환상 등). 값이 있을 때만 렌더한다 */
  badge?: string
}

const InfoCardTitleComponent = ({
  id,
  title,
  badge,
}: InfoCardTitleComponentProps) => {
  return (
    <h2
      id={id}
      className="flex w-full h-8 leading-8 mb-4 text-lg desktop:h-11 desktop:leading-[2.75rem] desktop:mb-6 desktop:text-[1.75rem] font-bold text-left border-b border-solid border-primary-1 items-center gap-2"
    >
      {title}
      {badge && (
        <span className="h-5 rounded-md bg-primary-1 px-2 text-2xs font-semibold leading-5 text-primary-4 desktop:h-6 desktop:text-xs desktop:leading-6">
          {badge}
        </span>
      )}
    </h2>
  )
}

export default InfoCardTitleComponent
