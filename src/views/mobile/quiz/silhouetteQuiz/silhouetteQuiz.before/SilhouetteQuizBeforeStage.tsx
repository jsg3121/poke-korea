'use client'

import Link from 'next/link'
import MobileSilhouetteGuideBottomBanner from '~/components/adSlot/MobileSilhouetteGuideBottomBanner'
import PageHeader from '~/components/mobile/PageHeader'
import {
  QUIZ_CONFIG,
  QUIZ_SEO_CONTENT,
  QUIZ_CROSS_LINKS,
} from '~/constants/quiz.constants'
import { useSilhouetteQuizContext } from '~/context/SilhouetteQuiz.context'
import GuideStartButton from '../../components/guide/GuideStartButton'

const SilhouetteQuizBeforeStage = () => {
  const { onChangeStage } = useSilhouetteQuizContext()
  const seoContent = QUIZ_SEO_CONTENT.silhouette

  const handleClickStartButton = () => {
    onChangeStage('QUIZ')
  }

  return (
    <section className="h-full w-full px-[20px]">
      <PageHeader
        title={QUIZ_CONFIG[0].title}
        description={QUIZ_CONFIG[0].description}
      />
      <article className="w-full p-[1.5rem] rounded-[20px] bg-primary-4 flex flex-col items-center justify-between gap-[2rem]">
        <ul className="w-full [&>li]:text-base [&>li]:leading-[1.8] [&>li]:text-primary-1 [&>li]:mb-[0.5rem]">
          <li>1. 검은 실루엣으로 가려진 포켓몬을 맞춰보세요!</li>
          <li>2. 4개의 선택지 중 정확한 포켓몬의 이름을 선택하세요.</li>
          <li>3. 너무 어렵다면 다음 문제로 넘어갈 수 있어요.</li>
          <li>4. 20문제를 완료한 후 결과를 확인하세요.</li>
        </ul>
        <GuideStartButton onClickStartButton={handleClickStartButton} />
      </article>
      <article className="w-full mt-4 p-[1.5rem] rounded-[20px] bg-primary-4">
        {seoContent.sections.map((section) => (
          <div key={section.title} className="mb-4 last:mb-0">
            <h3 className="text-base font-bold text-primary-1 mb-1">
              {section.title}
            </h3>
            <p className="text-sm text-primary-1 leading-relaxed">
              {section.content}
            </p>
          </div>
        ))}
        <div className="mt-4 pt-4 border-t border-gray-200">
          {seoContent.relatedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-blue-600 hover:underline"
            >
              {link.text} →
            </Link>
          ))}
        </div>
      </article>
      <article className="w-full mt-4 p-[1.5rem] rounded-[20px] bg-primary-4">
        <h3 className="text-base font-bold text-primary-1 mb-3">
          다른 퀴즈도 도전해보세요
        </h3>
        <ul className="space-y-2">
          {QUIZ_CROSS_LINKS.filter((link) => link.type !== 'silhouette').map(
            (link) => (
              <li key={link.type}>
                <Link
                  href={link.route}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {link.title} →
                </Link>
              </li>
            ),
          )}
        </ul>
      </article>
      <MobileSilhouetteGuideBottomBanner />
    </section>
  )
}

export default SilhouetteQuizBeforeStage
