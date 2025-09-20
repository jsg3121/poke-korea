'use client'

import Link from 'next/link'
import { useAbilityQuizContext } from '~/context/AbilityQuiz.context'
import { formatTime } from '~/utils/quiz.util'

const AbilityQuizResult = () => {
  const { result, onClickRetryQuiz } = useAbilityQuizContext()

  if (!result) return null

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return '🏆 특성 마스터!'
    if (percentage >= 70) return '⭐ 훌륭해요!'
    if (percentage >= 50) return '👍 괜찮은 실력이에요!'
    return '📚 더 공부해보세요!'
  }

  return (
    <div className="w-full min-h-screen bg-primary-4 px-[20px] py-[2rem]">
      <div className="bg-white rounded-[1rem] p-[2rem]">
        <div className="text-center mb-[2rem]">
          <h1 className="text-[2rem] font-bold text-primary-4 mb-[0.5rem]">
            특성 퀴즈 완료!
          </h1>
          <p className="text-[1rem] text-gray-600">
            {getScoreMessage(result.percentage)}
          </p>
        </div>

        <div className="space-y-[1rem] mb-[2rem]">
          <div className="bg-primary-4 rounded-[1rem] p-[1.5rem] text-center text-white">
            <div className="text-[2.5rem] font-bold mb-[0.25rem]">
              {result.correctAnswers}
            </div>
            <div className="text-[1rem]">맞춘 문제</div>
            <div className="text-[0.75rem] opacity-80">
              / {result.correctAnswers + result.wrongAnswers}문제
            </div>
          </div>

          <div className="bg-purple-500 rounded-[1rem] p-[1.5rem] text-center text-white">
            <div className="text-[2.5rem] font-bold mb-[0.25rem]">
              {Math.round(result.percentage)}%
            </div>
            <div className="text-[1rem]">정답률</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[1rem] mb-[2rem]">
          <div className="bg-gray-100 rounded-[1rem] p-[1rem] text-center">
            <div className="text-[1.25rem] font-bold text-gray-700 mb-[0.25rem]">
              {formatTime(result.totalTime)}
            </div>
            <div className="text-[0.75rem] text-gray-600">총 소요 시간</div>
          </div>

          <div className="bg-gray-100 rounded-[1rem] p-[1rem] text-center">
            <div className="text-[1.25rem] font-bold text-gray-700 mb-[0.25rem]">
              {formatTime(result.averageTime)}
            </div>
            <div className="text-[0.75rem] text-gray-600">평균 시간</div>
          </div>
        </div>

        <div className="space-y-[0.75rem]">
          <button
            onClick={onClickRetryQuiz}
            className="w-full py-[0.875rem] bg-primary-2 text-white rounded-[1rem] hover:bg-primary-1 transition-colors"
          >
            다시 도전하기
          </button>
          <Link
            href="/quiz"
            className="block w-full py-[0.875rem] bg-gray-500 text-white text-center rounded-[1rem] hover:bg-gray-600 transition-colors"
          >
            퀴즈 목록으로
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AbilityQuizResult