/**
 * 포켓볼 그래픽 (DS 원자). 포켓몬 서비스의 브랜드 자산 — 카드 장식, 폼 컨트롤(Radio/
 * Checkbox)의 체크 표시 등에 쓰인다.
 *
 * size로 크기를 고른다(모바일 퍼스트 차등 내장). size 없으면 부모 크기에 맞춘다
 * (w-full h-full) — 부모가 크기를 정하는 카드 등에서 사용.
 * - lg: 24→32px (카드 현행)
 * - md: 20→24px
 * - sm: 16px (체크박스·토글 등 작은 표시)
 *
 * 색은 포켓볼 그래픽 전용이라 토큰화하지 않는다(공유되지 않는 단일 그래픽 디테일).
 */

export type BallSize = 'sm' | 'md' | 'lg'

/** size별 크기 클래스 — 정적 매핑(purge 안전). 없으면 부모 크기(w-full h-full) */
const SIZE_CLASS: Record<BallSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5 desktop:w-6 desktop:h-6',
  lg: 'w-6 h-6 desktop:w-8 desktop:h-8',
}

interface BallComponentProps {
  /** 크기. 없으면 부모 크기에 맞춤(w-full h-full) */
  size?: BallSize
}

const BallComponent = ({ size }: BallComponentProps) => {
  const sizeClass = size ? SIZE_CLASS[size] : 'w-full h-full'
  return (
    <span
      className={`relative block ${sizeClass} rounded-full border border-solid border-[#aaaaaa] overflow-hidden transition-transform will-change-transform`}
    >
      <i className="absolute top-0 left-1/2 w-full h-1/2 bg-[#ff0000] rounded-t-[10rem] border-b border-solid border-black transform -translate-x-1/2 z-[1] box-border shadow-[inset_3px_3px_0px_-2px_#ff7373,inset_-2px_0_0px_0px_#aa3333]" />
      <i className="absolute bottom-0 left-1/2 w-full h-1/2 bg-white rounded-b-[10rem] border-t border-solid border-black transform -translate-x-1/2 z-[2] box-border shadow-[inset_-2px_-1.5px_0px_0px_#d9d9d9]" />
      <i className="absolute top-1/2 left-1/2 w-1/2 h-1/2 bg-white border-2 border-solid border-black rounded-full transform -translate-x-1/2 -translate-y-1/2 z-[3] box-border shadow-[inset_-1.3px_-1.2px_0px_0px_#d9d9d9]" />
    </span>
  )
}

export default BallComponent
