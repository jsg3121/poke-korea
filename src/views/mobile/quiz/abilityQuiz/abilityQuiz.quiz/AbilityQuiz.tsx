import { useState } from 'react'
import QuizCountDownModalComponents from '~/components/quiz.modal/CountdownModal.component'
import AbilityQuizContainer from '~/container/mobile/quiz/abilityQuiz/AbilityQuiz.container'
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
    <section className="w-full min-h-screen px-[20px] py-[1rem] relative">
      {isShowCounter && (
        <QuizCountDownModalComponents
          quizTitle="특성 퀴즈!"
          onComplete={handleHideCounter}
        />
      )}
      <AbilityQuizContainer />
    </section>
  )
}

export default AbilityQuiz
