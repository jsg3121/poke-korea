'use client'

import Link from 'next/link'
import { useAbilityQuizContext } from '~/context/AbilityQuiz.context'
import { formatTime } from '~/utils/quiz.util'

const AbilityQuizResult = () => {
  const { result, onClickRetryQuiz } = useAbilityQuizContext()

  if (!result) return null

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return '🏆 특성 마스터! 완벽한 실력이네요!'
    if (percentage >= 70) return '⭐ 훌륭해요! 특성에 대해 잘 알고 있군요!'
    if (percentage >= 50) return '👍 괜찮은 실력이에요! 조금 더 공부해보세요!'
    return '📚 더 많은 특성을 학습해보세요!'
  }

  return (
    <div className="w-full max-w-[1280px] mx-auto bg-white rounded-[2rem] mt-[2rem] p-[3rem]">
      <div className="text-center mb-[3rem]">
        <h1 className="text-[2.5rem] font-bold text-primary-4 mb-[1rem]">
          특성 퀴즈 완료!
        </h1>
        <p className="text-[1.125rem] text-gray-600">
          {getScoreMessage(result.percentage)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-[2rem] mb-[3rem]">
        <div className="bg-primary-4 rounded-[1.5rem] p-[2rem] text-center text-white">
          <div className="text-[3rem] font-bold mb-[0.5rem]">
            {result.correctAnswers}
          </div>
          <div className="text-[1.125rem]">맞춘 문제</div>
          <div className="text-[0.875rem] opacity-80">
            / {result.correctAnswers + result.wrongAnswers}문제
          </div>
        </div>

        <div className="bg-purple-500 rounded-[1.5rem] p-[2rem] text-center text-white">
          <div className="text-[3rem] font-bold mb-[0.5rem]">
            {Math.round(result.percentage)}%
          </div>
          <div className="text-[1.125rem]">정답률</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[2rem] mb-[3rem]">
        <div className="bg-gray-100 rounded-[1.5rem] p-[2rem] text-center">
          <div className="text-[2rem] font-bold text-gray-700 mb-[0.5rem]">
            {formatTime(result.totalTime)}
          </div>
          <div className="text-[1rem] text-gray-600">총 소요 시간</div>
        </div>

        <div className="bg-gray-100 rounded-[1.5rem] p-[2rem] text-center">
          <div className="text-[2rem] font-bold text-gray-700 mb-[0.5rem]">
            {formatTime(result.averageTime)}
          </div>
          <div className="text-[1rem] text-gray-600">문제당 평균 시간</div>
        </div>
      </div>

      <div className="flex gap-[1rem] justify-center">
        <button
          onClick={onClickRetryQuiz}
          className="px-[2rem] py-[1rem] bg-primary-2 text-white rounded-[1rem] hover:bg-primary-1 transition-colors"
        >
          다시 도전하기
        </button>
        <Link
          href="/quiz"
          className="px-[2rem] py-[1rem] bg-gray-500 text-white rounded-[1rem] hover:bg-gray-600 transition-colors"
        >
          퀴즈 목록으로
        </Link>
      </div>
    </div>
  )
}

export default AbilityQuizResult
