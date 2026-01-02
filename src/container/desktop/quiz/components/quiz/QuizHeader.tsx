import { formatTimeShort } from '~/utils/quiz.util'

interface QuizHeaderProps {
  quizName: string
  currentQuestionIndex: number
  timeElapsed: number
  progress: number
}

const QuizHeader = ({
  quizName,
  currentQuestionIndex,
  progress,
  timeElapsed,
}: QuizHeaderProps) => {
  return (
    <header className="bg-white rounded-t-[2rem] shadow-md p-[1.5rem]">
      <div className="flex-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{quizName}</h1>
          <p className="text-gray-600">문제 {currentQuestionIndex + 1} / 20</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-medium text-purple-600">
            {formatTimeShort(timeElapsed)}
          </div>
          <div className="text-sm text-gray-600">경과 시간</div>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </header>
  )
}

export default QuizHeader
