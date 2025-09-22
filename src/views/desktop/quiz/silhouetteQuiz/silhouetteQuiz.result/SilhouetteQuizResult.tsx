import Link from 'next/link'
import ImageComponent from '~/components/Image.component'
import { QUIZ_ROUTES } from '~/constants/quiz.constants'
import { useSilhouetteQuizContext } from '~/context/SilhouetteQuiz.context'
import { imageMode } from '~/module/buildMode'
import { getQuizResultCopy } from '~/module/quiz.module'
import { formatTime } from '~/utils/quiz.util'
import { getTextSize } from '../modules/getTextSize.module'
import CorrectIcon from '~/assets/icons/correct-icon.svg'

const SilhouetteQuizResult = () => {
  const { result, questions, onClickRetryQuiz } = useSilhouetteQuizContext()

  const { headline, subcopy, medal } = getQuizResultCopy(result?.score ?? 0)

  const handleClickRetryQuiz = () => {
    onClickRetryQuiz()
  }

  if (!result) {
    return null
  }

  return (
    <section className="h-[60rem] w-full max-w-[1280px] mx-auto pt-[3rem]">
      <header className="w-full h-[22rem]">
        <span className="w-fit h-[14rem] text-[10rem] block mx-auto">
          {medal}
        </span>
        <h1 className="w-full text-[2rem] font-bold text-center leading-[calc(2rem+2px)] text-primary-4">
          {headline}
        </h1>
        <p className="w-full h-[1.25rem] text-[1.25rem] text-center text-primary-3 leading-[calc(1.25rem+2px)] mt-[1.5rem]">
          {subcopy}
        </p>
      </header>
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
      <article className="w-full h-fit bg-primary-4 rounded-[2rem] py-[1rem] px-[2rem] mb-[2rem]">
        <h2 className="w-full h-[3rem] text-primary-1 font-bold leading-[calc(2rem+2px)] text-[1.25rem]">
          문제 정답
        </h2>
        <ul className="w-full h-52 flex items-center gap-4 overflow-x-auto relative [&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:h-[10px] [&::-webkit-scrollbar-thumb]:bg-primary-2 [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-track]:bg-primary-3 [&::-webkit-scrollbar-track]:rounded-xl">
          <li className="w-24 h-44 shrink-0 flex flex-col items-center bg-primary-1 sticky left-0 z-10 rounded-[1rem]">
            <p className="w-full h-24 text-[0.875rem] text-primary-4 text-center leading-[calc(5rem+2px)]">
              문제 포켓몬
            </p>
            <p className="w-full h-10 text-[0.875rem] text-primary-4 text-center leading-[calc(2rem+2px)]">
              정답
            </p>
            <p className="w-full h-10 text-[0.875rem] text-primary-4 text-center leading-[calc(2rem+2px)]">
              나의 답
            </p>
          </li>
          {questions.map((quiz, index) => {
            const userAnswer = quiz.options[result.userAnswers[index]]
            const realAnswer = quiz.options[quiz.correctAnswerIndex]

            const userAnswerTextSize = getTextSize(userAnswer)
            const realAnswerTextSize = getTextSize(realAnswer)

            return (
              <li key={quiz.id} className="w-24 h-44 shrink-0">
                <Link
                  href={`/detail/${quiz.correctPokemonId}`}
                  className="w-full h-full shrink-0 flex flex-col items-center justify-between"
                >
                  <i className="h-24">
                    <ImageComponent
                      width="5rem"
                      height="5rem"
                      src={`${imageMode}/${quiz.correctPokemonId}.webp`}
                      alt={`정답 포켓몬 ${realAnswer}`}
                    />
                  </i>
                  <p
                    className={`w-full h-10 text-center leading-[calc(2.5rem+2px)] text-primary-1 ${userAnswerTextSize === 'small' ? 'text-[0.75rem]' : 'text-[1rem]'}`}
                  >
                    {realAnswer}
                  </p>
                  <p
                    className={`w-full h-10 text-center leading-[calc(2.5rem+2px)] text-primary-1 relative ${realAnswerTextSize === 'small' ? 'text-[0.75rem]' : 'text-[1rem]'} ${realAnswer === userAnswer ? 'font-bold' : 'text-gray-400'}`}
                  >
                    {userAnswer}
                    {userAnswer === realAnswer && (
                      <i className="w-4 h-4 block absolute top-0 right-0 z-10">
                        <CorrectIcon />
                      </i>
                    )}
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      </article>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          className="h-[3rem] leading-[calc(3rem+2px)] px-[2rem] bg-primary-2 text-white font-medium rounded-lg hover:bg-primary-4 hover:text-primary-1 transition-colors"
          onClick={handleClickRetryQuiz}
        >
          다시 도전하기
        </button>
        <Link
          href={QUIZ_ROUTES.MAIN}
          className="h-[3rem] leading-[calc(3rem+2px)] px-[2rem] bg-primary-3 text-black-2 font-medium rounded-lg hover:bg-primary-4 transition-colors"
        >
          다른 퀴즈 하러가기
        </Link>
      </div>
    </section>
  )
}

export default SilhouetteQuizResult
