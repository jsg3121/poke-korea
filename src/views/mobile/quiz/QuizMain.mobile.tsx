'use client'

import Link from 'next/link'
import { DeviceProvider } from '~/context/Device.context'
import HeaderContainer from '~/views/mobile/main/header/Header.container'
import { QUIZ_CONFIG } from '~/constants/quiz.constants'

const QuizMainMobile = () => {
  return (
    <DeviceProvider>
      <div className="min-h-screen bg-gray-50">
        <HeaderContainer />

        <main className="px-4 py-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              포켓몬 퀴즈
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              다양한 포켓몬 퀴즈를 통해
              <br />
              여러분의 포켓몬 지식을 테스트해보세요!
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {QUIZ_CONFIG.map((quiz) => (
              <Link key={quiz.type} href={quiz.route} className="block">
                <div className="bg-white rounded-lg shadow-md active:shadow-sm transition-all duration-200 overflow-hidden border border-gray-200 active:scale-[0.98]">
                  <div className="p-4 text-white">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{quiz.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-0.5">
                          {quiz.title}
                        </h3>
                        <p className="text-xs opacity-90">20문제 | 객관식</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                      {quiz.description}
                    </p>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">
                        예상 소요시간: 5-10분
                      </span>
                      <span className="text-blue-600 font-medium">
                        시작하기 →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-3">퀴즈 안내</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                모든 퀴즈는 20문제로 구성되어 있습니다
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                4지선다 객관식 문제입니다
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                문제를 시작하면 타이머가 작동됩니다
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                모든 문제를 완료하면 결과를 확인할 수 있습니다
              </li>
            </ul>
          </div>
        </main>
      </div>
    </DeviceProvider>
  )
}

export default QuizMainMobile
