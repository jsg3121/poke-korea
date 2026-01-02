'use client'

import MobileSilhouetteGuideBottomBanner from '~/components/adSlot/MobileSilhouetteGuideBottomBanner'
import PageHeader from '~/components/mobile/PageHeader'
import { QUIZ_CONFIG } from '~/constants/quiz.constants'
import { useSilhouetteQuizContext } from '~/context/SilhouetteQuiz.context'
import GuideStartButton from '../../components/guide/GuideStartButton'

const SilhouetteQuizBeforeStage = () => {
  const { onChangeStage } = useSilhouetteQuizContext()

  const handleClickStartButton = () => {
    onChangeStage('QUIZ')
  }

  return (
    <section className="h-full w-full px-[20px]">
      <PageHeader
        title={QUIZ_CONFIG[0].title}
        description={QUIZ_CONFIG[0].description}
      />
      <article className="w-full h-[20rem] p-[1.5rem] rounded-[20px] bg-primary-4 flex flex-col items-center justify-between gap-[2rem]">
        <ul className="w-full [&>li]:text-base [&>li]:leading-[1.8] [&>li]:text-primary-1 [&>li]:mb-[0.5rem]">
          <li>1. 검은 실루엣으로 가려진 포켓몬을 맞춰보세요!</li>
          <li>2. 4개의 선택지 중 정확한 포켓몬의 이름을 선택하세요.</li>
          <li>3. 너무 어렵다면 다음 문제로 넘어갈 수 있어요.</li>
          <li>4. 20문제를 완료한 후 결과를 확인하세요.</li>
        </ul>
        <GuideStartButton onClickStartButton={handleClickStartButton} />
      </article>
      <MobileSilhouetteGuideBottomBanner />
    </section>
  )
}

export default SilhouetteQuizBeforeStage
