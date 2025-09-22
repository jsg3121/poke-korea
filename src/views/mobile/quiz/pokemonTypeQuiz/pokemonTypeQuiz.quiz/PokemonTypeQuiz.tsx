'use client'

import { useState } from 'react'
import QuizCountDownModalComponents from '~/components/quiz.modal/CountdownModal.component'
import PokemonTypeQuizContainer from '~/container/desktop/quiz/pokemonTypeQuiz/PokemonTypeQuiz.container'
import { usePokemonTypeQuizContext } from '~/context/PokemonTypeQuiz.context'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'

const PokemonTypeQuiz = () => {
  const [isShowCounter, setIsShowCounter] = useState<boolean>(true)
  const { onStartCountdown } = usePokemonTypeQuizContext()

  const handleHideCounter = () => {
    setIsShowCounter(false)
    onStartCountdown()
  }
  useBodyScrollLock(isShowCounter)

  return (
    <div className="w-full min-h-screen px-[20px] py-[1rem] relative">
      {isShowCounter && (
        <QuizCountDownModalComponents
          quizTitle="포켓몬 타입 퀴즈!"
          onComplete={handleHideCounter}
        />
      )}
      <PokemonTypeQuizContainer />
    </div>
  )
}

export default PokemonTypeQuiz
