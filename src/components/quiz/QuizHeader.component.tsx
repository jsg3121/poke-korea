import { formatTimeShort } from '~/utils/quiz.util'

interface QuizHeaderProps {
  quizName: string
  currentQuestionIndex: number
  totalQuestions: number
  timeElapsed: number
  progress: number
}

const QuizHeader = ({
  quizName,
  currentQuestionIndex,
  totalQuestions,
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
            문제 {currentQuestionIndex + 1} / {totalQuestions}
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

export default QuizHeader
