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
    <div className="w-full max-w-[1280px] mx-auto h-[48rem] bg-primary-4 rounded-[2rem] mt-[2rem] relative">
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
