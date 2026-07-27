import { QUIZ_CONSTANTS } from '~/constants/quiz.constants'
import { formatTimeShort } from '~/utils/quiz.util'

/**
 * 퀴즈 진행 헤더 (DS 컴포넌트). 퀴즈명 + 진행도(문제 N/총) + 경과 시간 + 진행바.
 * 진행 단계(QUIZ) 4종 퀴즈 공통. desktop/mobile 2벌을 반응형 단일로 통합했다.
 *
 * 기존 2벌은 진행바·시간·제목에 gray/purple 임의색을 썼으나(bg-purple-600 등),
 * 사이트 색 체계와 무관한 임의색이라 primary-1~4 토큰으로 정규화한다.
 * 진행바 트랙=primary-3, 채움=primary-1.
 */
interface QuizHeaderProps {
  quizName: string
  currentQuestionIndex: number
  timeElapsed: number
  progress: number
}

const QuizHeaderComponent = ({
  quizName,
  currentQuestionIndex,
  progress,
  timeElapsed,
}: QuizHeaderProps) => {
  return (
    <header className="bg-white rounded-[1rem] desktop:rounded-t-[2rem] shadow-md p-4 desktop:p-6">
      <div className="flex-between mb-3 desktop:mb-4">
        <div>
          <h1 className="text-xl desktop:text-2xl font-bold text-primary-1">
            {quizName}
          </h1>
          <p className="text-sm desktop:text-base text-primary-2">
            문제 {currentQuestionIndex + 1} / {QUIZ_CONSTANTS.TOTAL_QUESTIONS}
          </p>
        </div>
        <div className="text-right">
          <div className="text-base desktop:text-lg font-medium text-primary-1">
            {formatTimeShort(timeElapsed)}
          </div>
          <div className="text-xs desktop:text-sm text-primary-2">
            경과 시간
          </div>
        </div>
      </div>
      <div className="w-full bg-primary-3 rounded-full h-2">
        <div
          className="bg-primary-1 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  )
}

export default QuizHeaderComponent
