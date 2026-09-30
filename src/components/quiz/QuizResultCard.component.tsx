import { ReactNode } from 'react'

import CorrectIcon from '~/assets/icons/correct-icon.svg'
import WrongIcon from '~/assets/icons/wrong-correct.svg'

interface QuizResultCardProps {
  index: number
  isCorrect: boolean
  typeLabel?: string
  children: ReactNode
  correctAnswer: ReactNode
  userAnswer: ReactNode
}

const QuizResultCard = ({
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

      <div className="pb-3 border-b border-solid border-primary-3">
        {children}
      </div>

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

export default QuizResultCard
