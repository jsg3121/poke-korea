'use client'

import Link from 'next/link'
import DesktopSilhouetteGuideBottomBanner from '~/components/adSlot/DesktopSilhouetteGuideBottomBanner'
import PageHeader from '~/components/PageHeader'
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

  const handleClickChangeStage = () => {
    onChangeStage('QUIZ')
  }

  return (
    <section className="h-full w-full max-w-[1280px] mx-auto">
      <PageHeader
        title={QUIZ_CONFIG[0].title}
        description={QUIZ_CONFIG[0].description}
      />
      <article className="w-full border-solid p-[3rem] rounded-[20px] bg-primary-4 flex flex-col justify-between">
        <ul className="w-full h-[calc(100%-10rem)] [&>li]:h-[3rem] [&>li]:text-xl [&>li]:leading-[3rem] [&>li]:text-primary-1 mb-[2rem]">
          <li>1. 검은 실루엣으로 가려진 포켓몬을 맞춰보세요!</li>
          <li>2. 4개의 선택지 중 정확한 포켓몬의 이름을 선택하세요.</li>
          <li>3. 너무 어렵다면 다음 문제로 넘어갈 수 있어요.</li>
          <li>4. 20문제를 완료한 후 결과를 확인하세요.</li>
        </ul>
        <GuideStartButton onClickStartButton={handleClickChangeStage} />
      </article>
      <article className="w-full mt-6 p-[3rem] rounded-[20px] bg-primary-4">
        {seoContent.sections.map((section) => (
          <div key={section.title} className="mb-6 last:mb-0">
            <h3 className="text-lg font-bold text-primary-1 mb-2">
              {section.title}
            </h3>
            <p className="text-primary-1 leading-relaxed">
              {section.content}
            </p>
          </div>
        ))}
        <div className="mt-6 pt-6 border-t border-gray-200">
          {seoContent.relatedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-blue-600 hover:underline"
            >
              {link.text} →
            </Link>
          ))}
        </div>
      </article>
      <article className="w-full mt-6 p-[3rem] rounded-[20px] bg-primary-4">
        <h3 className="text-lg font-bold text-primary-1 mb-4">
          다른 퀴즈도 도전해보세요
        </h3>
        <ul className="space-y-2">
          {QUIZ_CROSS_LINKS.filter(
            (link) => link.type !== 'silhouette',
          ).map((link) => (
            <li key={link.type}>
              <Link
                href={link.route}
                className="text-blue-600 hover:underline"
              >
                {link.title} →
              </Link>
            </li>
          ))}
        </ul>
      </article>
      <DesktopSilhouetteGuideBottomBanner />
    </section>
  )
}

export default SilhouetteQuizBeforeStage
