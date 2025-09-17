import Link from 'next/link'
import ImageComponent from '~/components/Image.component'
import { QUIZ_ROUTES } from '~/constants/quiz.constants'
import { useSilhouetteQuizContext } from '~/context/SilhouetteQuiz.context'
import { imageMode } from '~/module/buildMode'
import { getQuizResultCopy } from '~/module/quiz.module'
import { formatTime } from '~/utils/quiz.util'

const SilhouetteQuizResult = () => {
  const { result, questions } = useSilhouetteQuizContext()

  const { headline, subcopy, medal } = getQuizResultCopy(result?.score ?? 0)

  if (!result) {
    return null
  }

  return (
    <section className="h-[calc(100vh-12rem)] min-h-[47.5rem] w-full max-w-[1280px] mx-auto pt-[3rem]">
      <div className="w-full h-[22rem]">
        <span className="w-fit h-[14rem] text-[10rem] block mx-auto">
          {medal}
        </span>
        <h1 className="w-full text-[2rem] font-bold text-center leading-[calc(2rem+2px)] text-primary-4">
          {headline}
        </h1>
        <p className="w-full h-[1.25rem] text-[1.25rem] text-center text-primary-3 leading-[calc(1.25rem+2px)] mt-[1.5rem]">
          {subcopy}
        </p>
      </div>
      <dl className="w-full h-[6.5rem] bg-primary-4 rounded-[2rem] p-[2rem] flex items-center justify-around mb-[2rem]">
        <dt className="text-[1.25rem] font-[500] h-[2.5rem] leading-[calc(2.5rem+2px)] text-primary-1">
          맞은 문제
        </dt>
        <dd className="text-[2.25rem] h-[2.5rem] leading-[calc(2.5rem+2px)] font-bold text-primary-1">
          {result.correctAnswers} 개
        </dd>
        <dt className="text-[1.25rem] font-[500] h-[2.5rem] leading-[calc(2.5rem+2px)] text-primary-1">
          정답률
        </dt>
        <dd className="text-[2.25rem] h-[2.5rem] leading-[calc(2.5rem+2px)] font-bold text-primary-1">
          {result.percentage} %
        </dd>
        <dt className="text-[1.25rem] font-[500] h-[2.5rem] leading-[calc(2.5rem+2px)] text-primary-1">
          소요 시간
        </dt>
        <dd className="text-[2.25rem] h-[2.5rem] leading-[calc(2.5rem+2px)] font-bold text-primary-1">
          {formatTime(result.totalTime)}
        </dd>
        <dt className="text-[1.25rem] font-[500] h-[2.5rem] leading-[calc(2.5rem+2px)] text-primary-1">
          평균 시간
        </dt>
        <dd className="text-[2.25rem] h-[2.5rem] leading-[calc(2.5rem+2px)] font-bold text-primary-1">
          {formatTime(result.averageTime)}
        </dd>
      </dl>
      <div className="w-full h-[12rem] bg-primary-4 rounded-[2rem] py-[1rem] px-[2rem] mb-[2rem]">
        <h2 className="w-full h-[3rem] text-primary-1 font-bold leading-[calc(2rem+2px)] text-[1.25rem]">
          문제 정답
        </h2>
        <ul className="h-[7.5rem] flex items-center overflow-x-auto gap-[0.75rem] [&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar-thumb]:bg-primary-2 [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-track]:bg-primary-3 [&::-webkit-scrollbar-track]:rounded-xl">
          {questions.map((quiz) => {
            return (
              <li key={quiz.id} className="w-[6rem] h-[7rem]">
                <Link
                  href={`/detail/${quiz.correctPokemonId}`}
                  className="w-[6rem] h-[6rem] shrink-0 flex flex-col items-center justify-between"
                >
                  <ImageComponent
                    width="4rem"
                    height="4rem"
                    src={`${imageMode}/${quiz.correctPokemonId}.webp`}
                  />
                  <p className="text-center text-[1rem] h-[1.25rem] text-primary-1">
                    {quiz.options[quiz.correctAnswerIndex]}
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
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
