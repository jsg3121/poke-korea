import { useState } from 'react'
import QuizCountDownModalComponents from '~/components/quiz.modal/CountdownModal.component'
import { useAbilityQuizContext } from '~/context/AbilityQuiz.context'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'
import { formatTimeShort } from '~/utils/quiz.util'

const AbilityQuiz = () => {
  const [isShowCounter, setIsShowCounter] = useState<boolean>(true)
  const {
    onStartCountdown,
    currentQuestionIndex,
    timeElapsed,
    progress,
    currentQuestion,
    submitAnswer,
  } = useAbilityQuizContext()

  const handleHideCounter = () => {
    setIsShowCounter(false)
    onStartCountdown()
  }

  const handleClickSelectAnswer = (index: number) => () => {
    submitAnswer(index)
  }

  const handleClickSkipAnswer = () => {
    submitAnswer(99)
  }

  useBodyScrollLock(isShowCounter)

  return (
    <div className="w-full min-h-screen bg-primary-4 px-[20px] py-[1rem] relative">
      {isShowCounter && (
        <QuizCountDownModalComponents
          quizTitle="특성 퀴즈!"
          onComplete={handleHideCounter}
        />
      )}

      <header className="bg-white rounded-[1rem] shadow-md py-[1rem] px-[1rem] mb-[1rem]">
        <div className="flex items-center justify-between mb-[0.75rem]">
          <div>
            <h1 className="text-[1.25rem] font-bold text-gray-800">특성 퀴즈</h1>
            <p className="text-[0.875rem] text-gray-600">
              문제 {currentQuestionIndex + 1} / 20
            </p>
          </div>
          <div className="text-right">
            <div className="text-[1rem] font-medium text-purple-600">
              {formatTimeShort(timeElapsed)}
            </div>
            <div className="text-[0.75rem] text-gray-600">경과 시간</div>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </header>

      <article className="bg-white rounded-[1rem] shadow-md py-[1.5rem] px-[1rem] flex-1 flex flex-col">
        <div className="mb-[1.5rem] p-[1rem] bg-gray-50 rounded-[1rem]">
          <h2 className="text-[0.875rem] text-gray-600 mb-[0.5rem]">특성 설명</h2>
          <p className="text-[1rem] leading-[1.6] text-gray-800">
            {currentQuestion?.abilityDescription}
          </p>
        </div>

        <h3 className="text-[1.125rem] font-medium text-primary-1 mb-[1rem] text-center">
          {currentQuestion?.question}
        </h3>

        <div className="space-y-[0.75rem] mb-[1.5rem]">
          {currentQuestion?.options.map((option, index) => (
            <button
              key={index}
              onClick={handleClickSelectAnswer(index)}
              className="w-full h-[3rem] px-[1rem] text-[1rem] text-left flex items-center rounded-[1rem] bg-primary-3 text-white hover:bg-primary-2 transition-colors"
            >
              <span className="w-[1.5rem] h-[1.5rem] rounded-full bg-white text-primary-3 text-[0.875rem] font-bold flex items-center justify-center mr-[0.75rem]">
                {index + 1}
              </span>
              {option.koreanName}
            </button>
          ))}
        </div>

        <button
          onClick={handleClickSkipAnswer}
          className="self-center px-[1.5rem] py-[0.5rem] text-[0.875rem] text-gray-500 border border-gray-300 rounded-[1rem] hover:bg-gray-50"
        >
          다음 문제
        </button>
      </article>
    </div>
  )
}

export default AbilityQuiz