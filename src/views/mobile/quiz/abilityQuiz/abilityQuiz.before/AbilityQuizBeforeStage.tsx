'use client'

import MobileAbilityGuideBottomBanner from '~/components/adSlot/MobileAbilityGuideBottomBanner'
import PageHeader from '~/components/mobile/PageHeader'
import { QUIZ_CONFIG } from '~/constants/quiz.constants'
import { useAbilityQuizContext } from '~/context/AbilityQuiz.context'
import GuideStartButton from '../../components/guide/GuideStartButton'

const AbilityQuizBeforeStage = () => {
  const { onChangeStage } = useAbilityQuizContext()

  const handleClickStartButton = () => {
    onChangeStage('QUIZ')
  }

  return (
    <section className="h-full w-full mx-auto px-[20px]">
      <PageHeader
        description={QUIZ_CONFIG[1].description}
        title={QUIZ_CONFIG[1].title}
      />
      <article className="w-full h-[20rem] p-[1.5rem] rounded-[20px] bg-primary-4 flex flex-col items-center justify-between gap-[2rem]">
        <ul className="w-full [&>li]:text-base [&>li]:leading-[1.8] [&>li]:text-primary-1 [&>li]:mb-[0.5rem]">
          <li>1. 특성 설명을 보고 어떤 특성인지 맞춰보세요!</li>
          <li>2. 4개의 선택지 중 정답을 골라보세요.</li>
          <li>3. 너무 어렵다면 다음 문제로 넘어갈 수 있어요.</li>
          <li>4. 20문제를 완료한 후 결과를 확인하세요.</li>
        </ul>
        <GuideStartButton onClickStartButton={handleClickStartButton} />
      </article>
      <MobileAbilityGuideBottomBanner />
    </section>
  )
}

export default AbilityQuizBeforeStage
