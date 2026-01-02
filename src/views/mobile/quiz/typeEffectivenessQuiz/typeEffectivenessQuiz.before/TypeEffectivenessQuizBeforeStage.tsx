'use client'

import MobileTypeEffectivenessQuizGuideBottomBanner from '~/components/adSlot/MobileTypeEffectivenessQuizGuideBottomBanner'
import PageHeader from '~/components/mobile/PageHeader'
import { QUIZ_CONFIG } from '~/constants/quiz.constants'
import { useTypeEffectivenessQuizContext } from '~/context/TypeEffectivenessQuiz.context'
import GuideStartButton from '../../components/guide/GuideStartButton'

const TypeEffectivenessQuizBeforeStage = () => {
  const { onChangeStage } = useTypeEffectivenessQuizContext()

  const handleClickStartButton = () => {
    onChangeStage('QUIZ')
  }

  return (
    <section className="h-full w-full mx-auto px-[20px]">
      <PageHeader
        description={QUIZ_CONFIG[3].description}
        title={QUIZ_CONFIG[3].title}
      />
      <article className="w-full h-[20rem] p-[1.5rem] rounded-[20px] bg-primary-4 flex flex-col items-center justify-between gap-[2rem]">
        <ul className="w-full [&>li]:text-base [&>li]:leading-[1.8] [&>li]:text-primary-1 [&>li]:mb-[0.5rem]">
          <li>1. 공격 타입과 방어 타입을 보고 데미지 배수를 맞춰보세요!</li>
          <li>2. 4개의 선택지 중 정확한 데미지 배수를 선택하세요.</li>
          <li>3. 단일 타입과 복합 타입 문제가 모두 나와요.</li>
          <li>4. 20문제를 완료한 후 결과를 확인하세요.</li>
        </ul>
        <GuideStartButton onClickStartButton={handleClickStartButton} />
      </article>
      <MobileTypeEffectivenessQuizGuideBottomBanner />
    </section>
  )
}

export default TypeEffectivenessQuizBeforeStage
