import Link from 'next/link'
import { Fragment } from 'react'
import DesktopQuizMainTopBanner from '~/components/adSlot/DesktopQuizMainTopBanner'
import PageHeader from '~/components/PageHeader'
import { QUIZ_CONFIG } from '~/constants/quiz.constants'
import FooterContainer from '~/container/desktop/footer/Footer.container'
import HeaderContainer from '~/container/desktop/header/Header.container'

const QuizMainDesktop = () => {
  return (
    <Fragment>
      <main className="w-full h-fit pt-40">
        <HeaderContainer />
        <section className="max-w-[1280px] mx-auto">
          <PageHeader
            title="포켓몬 퀴즈"
            description="다양한 포켓몬 퀴즈를 통해 여러분의 포켓몬 지식을 테스트해보세요!"
          />
          <DesktopQuizMainTopBanner />
          <article className="mt-6 bg-primary-4 rounded-[1rem] p-6 mx-auto">
            <h2 className="text-xl font-bold text-primary-1 mb-4">
              포켓몬 퀴즈에 도전하세요!
            </h2>
            <div className="space-y-3">
              <p className="text-primary-1 leading-relaxed">
                포케 코리아 퀴즈는 포켓몬에 대한 다양한 지식을 테스트할 수 있는
                4종류의 퀴즈를 제공합니다.
              </p>
              <p className="text-primary-1 leading-relaxed">
                <b className="font-bold">실루엣 퀴즈</b>,{' '}
                <b className="font-bold">특성 퀴즈</b>,{' '}
                <b className="font-bold">타입 퀴즈</b>,{' '}
                <b className="font-bold">타입 상성 퀴즈</b>까지{' '}
                <b className="font-bold">총 4가지</b>
                유형으로 구성되어 있으며, 각 퀴즈는 20문제 4지선다 객관식으로
                진행됩니다.
              </p>
              <p className="text-primary-1 leading-relaxed">
                초보 트레이너부터 포켓몬 마스터까지, 자신의 포켓몬 지식 수준을
                확인해보세요. 퀴즈를 완료하면 정답률과 소요 시간을 바로 확인할
                수 있습니다.
              </p>
            </div>
          </article>
          <article className="mt-6 bg-primary-4 rounded-[1rem] p-6 mx-auto">
            <h2 className="text-xl font-bold text-primary-1 mb-4">퀴즈 안내</h2>
            <ul className="space-y-2 text-primary-1">
              <li className="flex-items-gap-2">
                <span className="w-2 h-2 bg-primary-1 rounded-full"></span>총
                20문제로 이루어진 퀴즈를 풀어보세요
              </li>
              <li className="flex-items-gap-2">
                <span className="w-2 h-2 bg-primary-1 rounded-full"></span>
                모든 문제는 4지선다 형식으로 이루어져 있습니다.
              </li>
              <li className="flex-items-gap-2">
                <span className="w-2 h-2 bg-primary-1 rounded-full"></span>
                퀴즈 시작시 카운트가 지나면 타이머가 작동됩니다
              </li>
              <li className="flex-items-gap-2">
                <span className="w-2 h-2 bg-primary-1 rounded-full"></span>
                모든 문제를 완료하면 정답을 포함한 점수를 확인할 수 있습니다
              </li>
            </ul>
          </article>
          <div className="grid grid-cols-2 gap-6 mx-auto pt-6">
            {QUIZ_CONFIG.map((quiz) => (
              <Link
                key={quiz.type}
                href={quiz.route}
                aria-label={`${quiz.title} 시작하기`}
                className="group block bg-primary-4 rounded-[1rem] hover:scale-105 transition-[transform] duration-[0.15s]"
              >
                <article className="rounded-[1rem] overflow-hidden">
                  <header className="flex-items-gap-4 px-6 py-4 bg-primary-2 group-hover:bg-primary-3 transition-[background] duration-[0.15s]">
                    <span className="text-[2rem]">{quiz.icon}</span>
                    <h2 className="text-2xl text-primary-4 font-bold group-hover:text-primary-1 transition-[color] duration-[0.15s]">
                      {quiz.title}
                    </h2>
                  </header>
                  <div className="p-6">
                    <p className="text-primary-1 mb-4">{quiz.description}</p>
                    <p className="flex-between text-sm text-gray-500">
                      예상 소요시간: 5-10분
                      <span className="text-blue-600 text-sm font-medium">
                        {quiz.title} 시작하기 <span aria-hidden="true">→</span>
                      </span>
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <FooterContainer />
    </Fragment>
  )
}

export default QuizMainDesktop
