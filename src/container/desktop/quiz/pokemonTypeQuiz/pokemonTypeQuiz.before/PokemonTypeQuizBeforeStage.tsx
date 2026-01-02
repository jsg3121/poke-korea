'use client'

import DesktopPokemonTypeGuideBottomBanner from '~/components/adSlot/DesktopPokemonTypeGuideBottomBanner'
import { QUIZ_CONFIG } from '~/constants/quiz.constants'
import { usePokemonTypeQuizContext } from '~/context/PokemonTypeQuiz.context'
import GuideStartButton from '../../components/guide/GuideStartButton'
import PageHeader from '~/components/PageHeader'

const PokemonTypeQuizBeforeStage = () => {
  const { onChangeStage } = usePokemonTypeQuizContext()

  const handleClickChangeStage = () => {
    onChangeStage('QUIZ')
  }

  return (
    <section className="h-full w-full max-w-[1280px] mx-auto">
      <PageHeader
        title={QUIZ_CONFIG[2].title}
        description={QUIZ_CONFIG[2].description}
      />
      <article className="w-full border-solid p-[3rem] rounded-[20px] bg-primary-4 flex flex-col justify-between">
        <ul className="w-full h-[calc(100%-10rem)] [&>li]:h-[3rem] [&>li]:text-xl [&>li]:leading-[3rem] [&>li]:text-primary-1 mb-[2rem]">
          <li>1. 특정 타입을 가진 포켓몬을 골라보세요!</li>
          <li>2. 4개의 포켓몬 중 해당 타입을 가진 포켓몬을 선택하세요.</li>
          <li>3. 너무 어렵다면 다음 문제로 넘어갈 수 있어요.</li>
          <li>4. 20문제를 완료한 후 결과를 확인하세요.</li>
        </ul>
        <GuideStartButton onClickStartButton={handleClickChangeStage} />
      </article>
      <DesktopPokemonTypeGuideBottomBanner />
    </section>
  )
}

export default PokemonTypeQuizBeforeStage
