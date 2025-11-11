'use client'

import { useEffect } from 'react'
import Portal from './Portal.component'

interface QuizResultPopupProps {
  isOpen: boolean
  isCorrect: boolean
  quizType: 'ability' | 'silhouette' | 'type'
  onClose: () => void
}

const QuizResultPopup = ({
  isOpen,
  isCorrect,
  quizType,
  onClose,
}: QuizResultPopupProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const quizTypeLabel = {
    ability: '특성',
    silhouette: '실루엣',
    type: '타입',
  }[quizType]

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-result-title"
        aria-describedby="quiz-result-description"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Popup Content */}
        <div
          className="relative bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Result Icon */}
          <div className="flex justify-center mb-6" aria-hidden="true">
            {isCorrect ? (
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-5xl sm:text-6xl">✅</span>
              </div>
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-100 rounded-full flex items-center justify-center animate-shake">
                <span className="text-5xl sm:text-6xl">❌</span>
              </div>
            )}
          </div>

          {/* Result Text */}
          <h3
            id="quiz-result-title"
            className={`text-2xl sm:text-3xl font-bold text-center mb-4 ${
              isCorrect ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isCorrect ? '정답입니다!' : '오답입니다!'}
          </h3>

          <p
            id="quiz-result-description"
            className="text-center text-primary-2 mb-6 text-sm sm:text-base"
          >
            {quizTypeLabel} 퀴즈에 {isCorrect ? '성공' : '실패'}했습니다.
          </p>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-primary-1 to-primary-2 text-primary-4 font-bold py-3 sm:py-4 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-3"
            aria-label="퀴즈 결과 닫기"
          >
            확인
          </button>
        </div>
      </div>
    </Portal>
  )
}

export default QuizResultPopup
