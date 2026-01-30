'use client'

import Link from 'next/link'
import DesktopSilhouetteGuideBottomBanner from '~/components/adSlot/DesktopSilhouetteGuideBottomBanner'
import PageHeader from '~/components/PageHeader'
import { QUIZ_CONFIG, QUIZ_DESCRIPTION_LIST } from '~/constants/quiz.constants'
import { useSilhouetteQuizContext } from '~/context/SilhouetteQuiz.context'
import GuideStartButton from '../../components/guide/GuideStartButton'
import OtherQuizLink from './components/OtherQuizLink'

const SilhouetteQuizBeforeStage = () => {
  const { onChangeStage } = useSilhouetteQuizContext()
  const seoContent = QUIZ_DESCRIPTION_LIST.silhouette

  const handleClickChangeStage = () => {
    onChangeStage('QUIZ')
  }

  return (
    <section className="h-full w-full max-w-[1280px] mx-auto">
      <PageHeader
        title={QUIZ_CONFIG[0].title}
        description={QUIZ_CONFIG[0].description}
      />
      <section className="w-full mt-6 p-6 rounded-[20px] bg-primary-4">
        <h2 className="text-2xl font-bold text-primary-1 mb-3">실루엣 퀴즈</h2>
        {seoContent.sections.map((section) => (
          <div key={section.title} className="mb-6 last:mb-0">
            <h3 className="text-lg font-bold text-primary-1 mb-2">
              {section.title}
            </h3>
            <p className="text-primary-1">{section.content}</p>
          </div>
        ))}
        <GuideStartButton onClickStartButton={handleClickChangeStage} />
        <div className="mt-6 pt-6 border-t border-gray-200">
          {seoContent.relatedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-primary-2 hover:underline"
            >
              {link.text}
            </Link>
          ))}
        </div>
      </section>
      <OtherQuizLink currentQuiz="silhouette" />
      <DesktopSilhouetteGuideBottomBanner />
    </section>
  )
}

export default SilhouetteQuizBeforeStage
