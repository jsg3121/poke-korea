import Link from 'next/link'
import { DeviceProvider } from '~/context/Device.context'
import { QUIZ_CONFIG } from '~/constants/quiz.constants'
import HeaderContainer from '~/container/mobile/header/Header.container'
import FooterContainer from '~/container/mobile/footer/Footer.container'

const QuizMainMobile = () => {
  return (
    <DeviceProvider>
      <main className="w-full h-full">
        <HeaderContainer />
        <section className="w-full px-[20px]">
          <header className="w-full h-30 text-center border-b border-solid border-primary-4 pt-4">
            <h1 className="h-16 text-[2rem] text-center leading-[4rem] text-primary-4 font-bold">
              포켓몬 퀴즈
            </h1>
            <p className="text-[0.875rem] text-primary-3 max-w-2xl mx-auto">
              다양한 포켓몬 퀴즈를 통해 여러분의 포켓몬 지식을 테스트해보세요!
            </p>
          </header>
          <article className="mt-6 bg-primary-4 rounded-[1rem] p-6 mx-auto">
            <h2 className="text-xl font-bold text-primary-1 mb-4">퀴즈 안내</h2>
            <ul className="space-y-2 text-primary-1">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                모든 퀴즈는 20문제로 구성되어 있습니다
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                4지선다 객관식 문제입니다
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                문제를 시작하면 타이머가 작동됩니다
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                모든 문제를 완료하면 결과를 확인할 수 있습니다
              </li>
            </ul>
          </article>
          <div className="flex flex-col gap-[1rem] mx-auto pt-[1rem]">
            {QUIZ_CONFIG.map((quiz) => (
              <Link
                key={quiz.type}
                href={quiz.route}
                className="block bg-primary-4 rounded-[1rem]"
              >
                <article className="rounded-[1rem] overflow-hidden">
                  <header className="flex items-center gap-4 px-6 py-4 bg-primary-2">
                    <span className="text-[2rem]">{quiz.icon}</span>
                    <h2 className="text-[1.5rem] text-primary-4 font-bold">
                      {quiz.title}
                    </h2>
                  </header>
                  <div className="p-6">
                    <p className="text-primary-1 mb-4">{quiz.description}</p>
                    <p className="flex items-center justify-between text-[0.875rem] text-gray-500">
                      예상 소요시간: 5-10분
                      <span className="text-blue-600 text-[0.875rem] font-medium">
                        시작하기 →
                      </span>
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
        <FooterContainer />
      </main>
    </DeviceProvider>
  )
}

export default QuizMainMobile
