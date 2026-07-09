/**
 * 상세 카드 제목 (기존 데/모 InfoCardTitle 이관 — 반응형 단일 컨테이너 전용).
 * 구버전 제거 시 container/desktop·mobile 쪽 원본도 함께 정리한다.
 */
interface InfoCardTitleComponentProps {
  title: string
  id?: string
}

const InfoCardTitleComponent = ({ id, title }: InfoCardTitleComponentProps) => {
  return (
    <h2
      id={id}
      className="w-full h-11 text-lg desktop:text-[1.75rem] leading-[2.75rem] font-bold text-left border-b border-solid border-primary-1 mb-6"
    >
      {title}
    </h2>
  )
}

export default InfoCardTitleComponent
