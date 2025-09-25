'use client'

import { useState } from 'react'
import QuizCountDownModalComponents from '~/components/quiz.modal/CountdownModal.component'
import TypeEffectivenessQuizContainer from '~/container/desktop/quiz/typeEffectivenessQuiz/TypeEffectivenessQuiz.container'
import { useTypeEffectivenessQuizContext } from '~/context/TypeEffectivenessQuiz.context'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'

const TypeEffectivenessQuiz = () => {
  const [isShowCounter, setIsShowCounter] = useState<boolean>(true)
  const { onStartCountdown } = useTypeEffectivenessQuizContext()

  const handleHideCounter = () => {
    setIsShowCounter(false)
    onStartCountdown()
  }
  useBodyScrollLock(isShowCounter)

  return (
    <div className="w-full max-w-[1280px] mx-auto h-[48rem] bg-primary-4 rounded-[2rem] mt-[2rem] relative">
      {isShowCounter && (
        <QuizCountDownModalComponents
          quizTitle="타입 상성 퀴즈!"
          onComplete={handleHideCounter}
        />
      )}
      <TypeEffectivenessQuizContainer />
    </div>
  )
}

export default TypeEffectivenessQuiz