import { ReactNode } from 'react'

/**
 * 퀴즈 선택지 버튼 (QUIZ 단계, 신규 DS). 4지선다 옵션 1개.
 * 두 형태를 지원한다:
 *  - variant="text": 번호 + 텍스트(실루엣/특성/타입상성). pill 형태.
 *  - variant="image": 포켓몬 이미지 + 이름(포켓몬 타입). 카드 형태.
 *
 * 기존 pokemon-type 모바일 옵션은 배경(bg-primary-3)이 누락돼 클릭 영역이
 * 보이지 않는 버그가 있었다 → 두 variant 모두 배경을 항상 부여하고,
 * 접근성 위해 focus-visible 링을 추가한다(기존 .btn-quiz-answer엔 focus 없음).
 */
interface QuizOptionButtonProps {
  onClick: () => void
  variant?: 'text' | 'image'
  /** variant="text" 시 앞 번호 (1-based) */
  optionNumber?: number
  children: ReactNode
}

const QuizOptionButtonComponent = ({
  onClick,
  variant = 'text',
  optionNumber,
  children,
}: QuizOptionButtonProps) => {
  const focusRing =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1'

  if (variant === 'image') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex flex-col items-center gap-3 p-4 rounded-[1rem] bg-primary-3 text-primary-1 hover:bg-primary-2 hover:text-primary-4 transition-colors ${focusRing}`}
      >
        {children}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center min-h-touch desktop:min-h-touch-lg py-2 px-4 rounded-full bg-primary-3 text-primary-1 hover:bg-primary-2 hover:text-primary-4 transition-colors ${focusRing}`}
    >
      {optionNumber !== undefined && (
        <span className="w-4 mr-3.5 text-sm desktop:text-base font-bold shrink-0">
          {optionNumber}
        </span>
      )}
      <span className="text-left text-xs desktop:text-base">{children}</span>
    </button>
  )
}

export default QuizOptionButtonComponent
