import { useState } from 'react'
import QuizCountDownModalComponents from '~/components/quiz.modal/CountdownModal.component'
import AbilityQuizContainer from '~/container/desktop/quiz/abilityQuiz/AbilityQuiz.container'
import { useAbilityQuizContext } from '~/context/AbilityQuiz.context'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'

const AbilityQuiz = () => {
  const [isShowCounter, setIsShowCounter] = useState<boolean>(true)
  const { onStartCountdown } = useAbilityQuizContext()

  const handleHideCounter = () => {
    setIsShowCounter(false)
    onStartCountdown()
  }
  useBodyScrollLock(isShowCounter)

  return (
    <div className="w-full max-w-[1280px] mx-auto h-[35rem] bg-primary-4 rounded-[2rem] mt-[2rem] relative">
      {isShowCounter && (
        <QuizCountDownModalComponents
          quizTitle="특성 퀴즈!"
          onComplete={handleHideCounter}
        />
      )}
      <AbilityQuizContainer />
    </div>
  )
}

export default AbilityQuiz
