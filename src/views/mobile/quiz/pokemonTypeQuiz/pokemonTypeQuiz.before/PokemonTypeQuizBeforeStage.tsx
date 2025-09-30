'use client'

import { QUIZ_CONFIG } from '~/constants/quiz.constants'
import { usePokemonTypeQuizContext } from '~/context/PokemonTypeQuiz.context'
import GuideHeader from '../../components/guide/GuideHeader'
import GuideStartButton from '../../components/guide/GuideStartButton'

const PokemonTypeQuizBeforeStage = () => {
  const { onChangeStage } = usePokemonTypeQuizContext()

  const handleClickStartButton = () => {
    onChangeStage('QUIZ')
  }

  return (
    <section className="h-full w-full mx-auto px-[20px]">
      <GuideHeader
        title={QUIZ_CONFIG[2].title}
        description={QUIZ_CONFIG[2].description}
      />
      <article className="w-full h-[20rem] p-[1.5rem] rounded-[20px] bg-primary-4 flex flex-col items-center justify-between gap-[2rem]">
        <ul className="w-full [&>li]:text-[1rem] [&>li]:leading-[1.8] [&>li]:text-primary-1 [&>li]:mb-[0.5rem]">
          <li>1. 특정 타입을 가진 포켓몬을 골라보세요!</li>
          <li>2. 4개의 포켓몬 중 해당 타입을 가진 포켓몬을 선택하세요.</li>
          <li>3. 너무 어렵다면 다음 문제로 넘어갈 수 있어요.</li>
          <li>4. 20문제를 완료한 후 결과를 확인하세요.</li>
        </ul>
        <GuideStartButton onClickStartButton={handleClickStartButton} />
      </article>
    </section>
  )
}

export default PokemonTypeQuizBeforeStage
