'use client'

import { useCountdown } from '../../hook/useCountdown'

interface CountdownModalComponentsProps {
  onComplete: () => void
  quizTitle?: string
}

const getCountdownColor = (count: number) => {
  switch (count) {
    case 3:
      return 'text-red-500'
    case 2:
      return 'text-yellow-500'
    case 1:
      return 'text-green-500'
    default:
      return 'text-gray-600'
  }
}

const QuizCountDownModalComponents = ({
  onComplete,
  quizTitle = '퀴즈',
}: CountdownModalComponentsProps) => {
  const { count } = useCountdown({
    initialCount: 3,
    onComplete,
  })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <article className="bg-white rounded-[2rem] p-[1.5rem] w-[25rem] text-center">
        <header className="mb-[1rem]">
          <h2 className="text-[2rem] font-bold text-gray-800 mb-[1rem]">
            {quizTitle}
          </h2>
          <p className="text-gray-600">곧 퀴즈가 시작됩니다!</p>
        </header>
        <p
          className={`text-[4rem] font-bold ${getCountdownColor(count)} transition-all duration-300 transform ${
            count === 0 ? 'scale-110' : 'scale-100'
          }`}
        >
          {count}
        </p>
      </article>
    </div>
  )
}

export default QuizCountDownModalComponents
