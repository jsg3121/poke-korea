import { useState } from 'react'
import QuizCountDownModalComponents from '~/container/desktop/quiz/quiz.modal/CountdownModal.component'
import SilhouetteQuizContainer from '~/container/desktop/quiz/silhouetteQuiz/SilhouetteQuiz.container'

const SilhouetteQuiz = () => {
  const [isShowCounter, setIsShowCounter] = useState<boolean>(true)

  const handleHideCounter = () => {
    setIsShowCounter(false)
  }

  return (
    <section className="w-full h-full min-h-[calc(100vh-12rem)] bg-primary-4 rounded-[20px] mt-[2rem] relative">
      {isShowCounter && (
        <QuizCountDownModalComponents
          quizTitle="실루엣 퀴즈!"
          onComplete={handleHideCounter}
        />
      )}

      <SilhouetteQuizContainer />
    </section>
  )
}

export default SilhouetteQuiz
