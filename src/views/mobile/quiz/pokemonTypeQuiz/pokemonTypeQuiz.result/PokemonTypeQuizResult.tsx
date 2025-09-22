'use client'

import Link from 'next/link'
import ImageComponent from '~/components/Image.component'
import { QUIZ_ROUTES } from '~/constants/quiz.constants'
import { usePokemonTypeQuizContext } from '~/context/PokemonTypeQuiz.context'
import { PokemonType } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import { getQuizResultCopy } from '~/module/quiz.module'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import { formatTime } from '~/utils/quiz.util'
import CorrectIcon from '~/assets/icons/correct-icon.svg'

const PokemonTypeQuizResult = () => {
  const { result, questions, onClickRetryQuiz } = usePokemonTypeQuizContext()

  const { headline, medal, subcopy } = getQuizResultCopy(result?.score || 0)

  const handleClickRetryQuiz = () => {
    onClickRetryQuiz()
  }

  if (!result) return null

  return (
    <section className="w-[calc(100%-40px)] mx-auto pt-[1rem]">
      <header className="w-full h-[15rem]">
        <span className="w-fit h-[9rem] text-[6rem] block mx-auto">
          {medal}
        </span>
        <h1 className="w-full text-[1.5rem] font-bold text-center leading-[calc(1.5rem+2px)] text-primary-4">
          {headline}
        </h1>
        <p className="w-full h-[1.25rem] text-[1rem] text-center text-primary-3 leading-[calc(1.25rem+2px)] mt-[1.5rem]">
          {subcopy}
        </p>
      </header>
      <dl className="w-full bg-primary-4 rounded-[2rem] p-[1rem] mb-[2rem] grid grid-cols-[20%_30%_20%_30%]">
        <dt className="text-[1rem] font-[500] h-[2.5rem] leading-[calc(2.5rem+2px)] text-primary-1">
          맞은 문제
        </dt>
        <dd className="text-[1.25rem] h-[2.5rem] leading-[calc(2.5rem+2px)] font-bold text-primary-1 text-right pr-2">
          {result.correctAnswers} 개
        </dd>
        <dt className="text-[1rem] font-[500] h-[2.5rem] leading-[calc(2.5rem+2px)] text-primary-1">
          정답률
        </dt>
        <dd className="text-[1.25rem] h-[2.5rem] leading-[calc(2.5rem+2px)] font-bold text-primary-1 text-right pr-2">
          {result.percentage} %
        </dd>
        <dt className="text-[1rem] font-[500] h-[2.5rem] leading-[calc(2.5rem+2px)] text-primary-1">
          소요 시간
        </dt>
        <dd className="text-[1.25rem] h-[2.5rem] leading-[calc(2.5rem+2px)] font-bold text-primary-1 text-right pr-2">
          {formatTime(result.totalTime)}
        </dd>
        <dt className="text-[1rem] font-[500] h-[2.5rem] leading-[calc(2.5rem+2px)] text-primary-1">
          평균 시간
        </dt>
        <dd className="text-[1.25rem] h-[2.5rem] leading-[calc(2.5rem+2px)] font-bold text-primary-1 text-right pr-2">
          {formatTime(result.averageTime)}
        </dd>
      </dl>
      <article className="w-full h-fit py-[1rem] mb-[2rem]">
        <h2 className="w-full h-[3rem] text-primary-4 font-bold leading-[calc(2rem+2px)] text-[1.25rem] border-b border-solid border-primary-4 mb-4">
          정답
        </h2>
        <ul className="w-full flex flex-col gap-[1rem] items-center relative">
          {questions.map((quiz, index) => {
            const userAnswerId = quiz.options[result.userAnswers[index]].id
            const realAnswerId = quiz.options[quiz.correctAnswerIndex].id

            return (
              <li
                key={quiz.id}
                className="w-full h-50 flex flex-col bg-primary-4 rounded-[1rem] p-4"
              >
                <span className="w-full h-6 text-[1.25rem] text-primary-1 font-bold flex items-center gap-2 [&>svg]:w-[1.5rem] [&>svg]:h-[1.5rem]">
                  #{index + 1}{' '}
                  {userAnswerId === realAnswerId && (
                    <>
                      정답! <CorrectIcon />
                    </>
                  )}
                </span>
                <div className="w-full h-6 bg-primary-1 flex mt-2">
                  <p className="w-1/5 h-6 text-[1rem] leading-[calc(1.25rem+4px)] text-primary-4 text-center">
                    문제 타입
                  </p>
                  <p className="w-2/5 h-6 text-[1rem] leading-[calc(1.25rem+4px)] text-primary-4 text-center">
                    정답 포켓몬
                  </p>
                  <p className="w-2/5 h-6 text-[1rem] leading-[calc(1.25rem+4px)] text-primary-4 text-center">
                    선택 포켓몬
                  </p>
                </div>
                <div className="w-full h-28 flex items-center">
                  <p className="w-1/5 h-6 text-left text-[1rem] text-primary-1 ">
                    <span
                      className={`w-16 h-6 text-[0.75rem] text-center chip-type-${quiz.targetType.toLowerCase()} leading-[calc(1.5rem+2px)] rounded-full block mx-auto`}
                    >
                      {PokemonTypes[quiz.targetType as PokemonType]}
                    </span>
                  </p>
                  <div className="w-2/5 h-[6rem] flex items-center justify-center drop-shadow-[1px_1px_1px_#333333]">
                    <ImageComponent
                      width="5rem"
                      height="5rem"
                      src={`${imageMode}/${realAnswerId}.webp`}
                      alt={`정답 포켓몬 ${quiz.options[quiz.correctAnswerIndex].koreanName}`}
                    />
                  </div>
                  <div
                    className={`w-2/5 h-[6rem] flex items-center justify-center drop-shadow-[1px_1px_1px_#333333] ${userAnswerId === realAnswerId ? '' : 'opacity-70 grayscale'} relative`}
                  >
                    <ImageComponent
                      width={userAnswerId === realAnswerId ? '6rem' : '5rem'}
                      height={userAnswerId === realAnswerId ? '6rem' : '5rem'}
                      src={`${imageMode}/${userAnswerId}.webp`}
                      alt={`내가 선택한 포켓몬 ${quiz.options[result.userAnswers[index]].koreanName}`}
                      className={`will-change-[filter] ${userAnswerId === realAnswerId ? '' : 'grayscale opacity-70'}`}
                    />
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </article>
      <div className="flex gap-[1rem] justify-center">
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

export default PokemonTypeQuizResult
