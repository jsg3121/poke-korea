'use client'

import { useEffect } from 'react'
import { useCountdown } from '~/hooks/useCountdown'

interface CountdownModalComponentsProps {
  isOpen: boolean
  onComplete: () => void
  onCancel?: () => void
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
    case 0:
      return 'text-purple-600'
    default:
      return 'text-gray-600'
  }
}

const QuizCountDownModalComponents = ({
  isOpen,
  onComplete,
  onCancel,
  quizTitle = '퀴즈',
}: CountdownModalComponentsProps) => {
  const { count, isActive, start, stop } = useCountdown({
    initialCount: 3,
    onComplete,
  })

  useEffect(() => {
    if (isOpen && !isActive) {
      start()
    } else if (!isOpen && isActive) {
      stop()
    }
  }, [isOpen, isActive, start, stop])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <article className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{quizTitle}</h2>
          <p className="text-gray-600">곧 퀴즈가 시작됩니다!</p>
        </header>
        <div className="mb-8">
          <div
            className={`text-9xl font-bold ${getCountdownColor(count)} mb-4 transition-all duration-300 transform ${
              count === 0 ? 'scale-110' : 'scale-100'
            }`}
          >
            {count}
          </div>
          {count === 0 && (
            <p className="text-purple-600 text-lg font-medium animate-pulse">
              첫 번째 문제가 곧 나타납니다!
            </p>
          )}
        </div>
        {onCancel && count > 0 && (
          <button
            onClick={onCancel}
            className="px-6 py-2 text-gray-500 hover:text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            취소
          </button>
        )}
      </article>
    </div>
  )
}

export default QuizCountDownModalComponents
