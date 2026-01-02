'use client'

import DesktopAbilityGuideBottomBanner from '~/components/adSlot/DesktopAbilityGuideBottomBanner'
import PageHeader from '~/components/PageHeader'
import { QUIZ_CONFIG } from '~/constants/quiz.constants'
import { useAbilityQuizContext } from '~/context/AbilityQuiz.context'
import GuideStartButton from '../../components/guide/GuideStartButton'

const AbilityQuizBeforeStage = () => {
  const { onChangeStage } = useAbilityQuizContext()

  const handleClickChangeStage = () => {
    onChangeStage('QUIZ')
  }

  return (
    <section className="h-full w-full max-w-[1280px] mx-auto">
      <PageHeader
        title={QUIZ_CONFIG[1].title}
        description={QUIZ_CONFIG[1].description}
      />
      <article className="w-full border-solid p-[3rem] rounded-[20px] bg-primary-4 flex flex-col justify-between">
        <ul className="w-full h-[calc(100%-10rem)] [&>li]:h-[3rem] [&>li]:text-xl [&>li]:leading-[3rem] [&>li]:text-primary-1 mb-[2rem]">
          <li>1. 특성 설명을 보고 어떤 특성인지 맞춰보세요!</li>
          <li>2. 4개의 선택지 중 정답을 골라보세요.</li>
          <li>3. 너무 어렵다면 다음 문제로 넘어갈 수 있어요.</li>
          <li>4. 20문제를 완료한 후 결과를 확인하세요.</li>
        </ul>
        <GuideStartButton onClickStartButton={handleClickChangeStage} />
      </article>
      <DesktopAbilityGuideBottomBanner />
    </section>
  )
}

export default AbilityQuizBeforeStage
