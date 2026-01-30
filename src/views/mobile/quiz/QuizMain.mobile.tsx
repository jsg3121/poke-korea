import Link from 'next/link'
import { Fragment } from 'react'
import MobileQuizMainBottomBanner from '~/components/adSlot/MobileQuizMainBottomBanner'
import MobileQuizMainTopBanner from '~/components/adSlot/MobileQuizMainTopBanner'
import PageHeader from '~/components/mobile/PageHeader'
import MobileTabBar from '~/components/MobileTabBar'
import {
  QUIZ_CONFIG,
  QUIZ_MAIN_SEO_CONTENT,
} from '~/constants/quiz.constants'
import FooterContainer from '~/container/mobile/footer/Footer.container'
import HeaderContainer from '~/container/mobile/header/Header.container'

const QuizMainMobile = () => {
  return (
    <Fragment>
      <main className="w-full h-full">
        <HeaderContainer />
        <section className="w-full">
          <PageHeader
            title="포켓몬 퀴즈"
            description="다양한 포켓몬 퀴즈를 통해 여러분의 포켓몬 지식을 테스트해보세요!"
          />
          <MobileQuizMainTopBanner />
          <article className="w-[calc(100%-2.5rem)] mt-6 bg-primary-4 rounded-[1rem] p-6 mx-auto">
            <h2 className="text-xl font-bold text-primary-1 mb-4">
              {QUIZ_MAIN_SEO_CONTENT.title}
            </h2>
            <div className="space-y-3">
              {QUIZ_MAIN_SEO_CONTENT.descriptions.map(
                (desc, index) => (
                  <p
                    key={index}
                    className="text-primary-1 text-sm leading-relaxed"
                  >
                    {desc}
                  </p>
                ),
              )}
            </div>
          </article>
          <article className="w-[calc(100%-2.5rem)] mt-4 bg-primary-4 rounded-[1rem] p-6 mx-auto">
            <h2 className="text-xl font-bold text-primary-1 mb-4">
              퀴즈 안내
            </h2>
            <ul className="space-y-2 text-primary-1">
              <li className="flex-items-gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                모든 퀴즈는 20문제로 구성되어 있습니다
              </li>
              <li className="flex-items-gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                4지선다 객관식 문제입니다
              </li>
              <li className="flex-items-gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                문제를 시작하면 타이머가 작동됩니다
              </li>
              <li className="flex-items-gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                모든 문제를 완료하면 결과를 확인할 수 있습니다
              </li>
            </ul>
          </article>
          <div className="w-[calc(100%-2.5rem)] mx-auto flex flex-col gap-[1rem] pt-[1rem]">
            {QUIZ_CONFIG.map((quiz) => (
              <Link
                key={quiz.type}
                href={quiz.route}
                aria-label={`${quiz.title} 시작하기`}
                className="block bg-primary-4 rounded-[1rem]"
              >
                <article className="rounded-[1rem] overflow-hidden">
                  <header className="flex-items-gap-4 px-6 py-4 bg-primary-2">
                    <span className="text-[2rem]">{quiz.icon}</span>
                    <h2 className="text-2xl text-primary-4 font-bold">
                      {quiz.title}
                    </h2>
                  </header>
                  <div className="p-6">
                    <p className="text-primary-1 mb-4">
                      {quiz.description}
                    </p>
                    <p className="flex-between text-sm text-gray-500">
                      예상 소요시간: 5-10분
                      <span className="text-blue-600 text-sm font-medium">
                        {quiz.title} 시작하기{' '}
                        <span aria-hidden="true">→</span>
                      </span>
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
        <MobileQuizMainBottomBanner />
        <FooterContainer />
      </main>
      <MobileTabBar />
    </Fragment>
  )
}

export default QuizMainMobile
