import Link from 'next/link'
import { QUIZ_ROUTES } from '~/constants/quiz.constants'
import { useSilhouetteQuizContext } from '~/context/SilhouetteQuiz.context'
import { formatTime } from '~/utils/quiz.util'

const SilhouetteQuizResult = () => {
  const { result } = useSilhouetteQuizContext()

  if (!result) {
    return null
  }

  return (
    <section className="h-[calc(100vh-12rem)] w-full max-w-[1280px] mx-auto">
      <h1 className="w-full h-[4rem] text-[2.5rem] leading-[4rem] font-bold text-center text-primary-4 my-[2rem]">
        실루엣 퀴즈 완료!
      </h1>
      <dl className="w-full h-[6.5rem] bg-primary-4 rounded-[2rem] p-[2rem] flex items-center mb-[2rem]">
        <dt className="text-[1rem] w-1/4 h-[2.5rem] leading-[calc(2.5rem+2px)] text-gray-600">
          맞은 문제
        </dt>
        <dd className="text-[2rem] w-1/4 h-[2.5rem] leading-[calc(2.5rem+2px)] font-bold text-primary-1 flex items-center after:w-[1px] after:h-full after:bg-primary-3 after:block after:mx-auto">
          {result.correctAnswers} 개
        </dd>
        <dt className="text-[1rem] w-1/4 h-[2.5rem] leading-[calc(2.5rem+2px)] text-gray-600">
          정답률
        </dt>
        <dd className="text-[2rem] w-1/4 h-[2.5rem] leading-[calc(2.5rem+2px)] font-bold text-primary-1 flex items-center after:w-[1px] after:h-full after:bg-primary-3 after:block after:mx-auto">
          {result.percentage} %
        </dd>
        <dt className="text-[1rem] w-1/4 h-[2.5rem] leading-[calc(2.5rem+2px)] text-gray-600">
          총 시간
        </dt>
        <dd className="text-[2rem] w-1/4 h-[2.5rem] leading-[calc(2.5rem+2px)] font-bold text-primary-1 flex items-center after:w-[1px] after:h-full after:bg-primary-3 after:block after:mx-auto">
          {formatTime(result.totalTime)}
        </dd>
        <dt className="text-[1rem] w-1/4 h-[2.5rem] leading-[calc(2.5rem+2px)] text-gray-600">
          평균 시간
        </dt>
        <dd className="text-[2rem] w-1/4 h-[2.5rem] leading-[calc(2.5rem+2px)] font-bold text-primary-1">
          {formatTime(result.averageTime)}
        </dd>
      </dl>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors">
          다시 도전하기
        </button>
        <Link
          href={QUIZ_ROUTES.MAIN}
          className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          다른 퀴즈 해보기
        </Link>
      </div>
    </section>
  )
}

export default SilhouetteQuizResult
