import { useState } from 'react'
import QuizCountDownModalComponents from '~/components/quiz.modal/CountdownModal.component'
import SilhouetteQuizContainer from '~/container/desktop/quiz/silhouetteQuiz/SilhouetteQuiz.container'
import { useSilhouetteQuizContext } from '~/context/SilhouetteQuiz.context'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'

const SilhouetteQuiz = () => {
  const [isShowCounter, setIsShowCounter] = useState<boolean>(true)
  const { onStartCountdown } = useSilhouetteQuizContext()

  const handleHideCounter = () => {
    setIsShowCounter(false)
    onStartCountdown()
  }
  useBodyScrollLock(isShowCounter)

  return (
    <div className="w-[calc(100%-40px)] bg-primary-4 rounded-[2rem] mt-[2rem] mx-auto relative">
      {isShowCounter && (
        <QuizCountDownModalComponents
          quizTitle="실루엣 퀴즈!"
          onComplete={handleHideCounter}
        />
      )}
      <SilhouetteQuizContainer />
    </div>
  )
}

export default SilhouetteQuiz
