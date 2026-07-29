import { ReactNode } from 'react'
import CorrectIcon from '~/assets/icons/correct-icon.svg'
import WrongIcon from '~/assets/icons/wrong-correct.svg'

/**
 * 퀴즈 결과 정답 카드 (RESULT 단계, 신규 DS 공용 셸).
 * 4종 퀴즈(실루엣/특성/타입/타입상성)의 정답 목록을 하나의 셸로 통일한다
 * (도감 PokemonCardShell 선례 = 셸 공유 + 콘텐츠 슬롯).
 *
 * 기존엔 실루엣·타입이 desktop 가로 스크롤 테이블(sticky 열)이었으나,
 * 접근성·일관성 위해 4종 전부 세로 카드로 통일했다(UX-012).
 * desktop은 상위에서 grid-cols-2로 2열 배치해 스크롤 길이를 줄인다.
 *
 * 셸 = 좌측 강조선(정답=초록/오답=빨강) + 헤더(#N + 정답아이콘) + 본문 슬롯(children)
 *      + 정답/나의 답 2열 비교. 본문/비교 내용은 퀴즈 타입별로 슬롯 주입한다.
 */
interface QuizResultCardProps {
  /** 문제 번호 (1-based) */
  index: number
  /** 정답 여부 */
  isCorrect: boolean
  /** 카드 좌상단 퀴즈 종류 라벨 (예: "실루엣") */
  typeLabel?: string
  /** 문제 본문 슬롯 (질문/실루엣/타입칩 등) */
  children: ReactNode
  /** 정답 표시 슬롯 */
  correctAnswer: ReactNode
  /** 사용자 답 표시 슬롯 */
  userAnswer: ReactNode
}

const QuizResultCardComponent = ({
  index,
  isCorrect,
  typeLabel,
  children,
  correctAnswer,
  userAnswer,
}: QuizResultCardProps) => {
  return (
    <li
      className={`flex flex-col bg-primary-4 rounded-[1rem] p-4 border-l-4 ${
        isCorrect ? 'border-l-green-600' : 'border-l-red-600'
      }`}
    >
      {/* 헤더: 종류 라벨 + #N + 정답 여부 아이콘 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-baseline gap-2">
          {typeLabel && (
            <span className="text-xs text-primary-2">{typeLabel}</span>
          )}
          <span className="text-base font-bold text-primary-1">#{index}</span>
        </div>
        <i className="block w-6 h-6 [&>svg]:w-full [&>svg]:h-full">
          {isCorrect ? <CorrectIcon /> : <WrongIcon />}
        </i>
      </div>

      {/* 문제 본문 슬롯 */}
      <div className="pb-3 border-b border-solid border-primary-3">
        {children}
      </div>

      {/* 정답 / 나의 답 2열 비교 */}
      <div className="grid grid-cols-2 gap-2 pt-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-primary-2">정답</span>
          <div className="text-green-700 font-bold">{correctAnswer}</div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-primary-2">나의 답</span>
          <div
            className={
              isCorrect ? 'text-green-700 font-bold' : 'text-red-700 font-bold'
            }
          >
            {userAnswer}
          </div>
        </div>
      </div>
    </li>
  )
}

export default QuizResultCardComponent
