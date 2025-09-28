'use client'

import Link from 'next/link'
import CorrectIcon from '~/assets/icons/correct-icon.svg'
import ImageComponent from '~/components/Image.component'
import TagComponent from '~/components/Tag.component'
import { QUIZ_ROUTES } from '~/constants/quiz.constants'
import { usePokemonTypeQuizContext } from '~/context/PokemonTypeQuiz.context'
import { PokemonType } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import { getQuizResultCopy } from '~/module/quiz.module'
import ResultHeader from '../../components/result/ResultHeader'
import ResultSummary from '../../components/result/ResultSummary'

const PokemonTypeQuizResult = () => {
  const { result, questions, onClickRetryQuiz } = usePokemonTypeQuizContext()

  const { headline, medal, subcopy } = getQuizResultCopy(result?.score || 0)

  const handleClickRetryQuiz = () => {
    onClickRetryQuiz()
  }

  if (!result) return null

  return (
    <section className="w-[calc(100%-40px)] mx-auto pt-[1rem]">
      <ResultHeader headline={headline} medal={medal} subcopy={subcopy} />
      <ResultSummary
        averageTime={result.averageTime}
        correctAnswers={result.correctAnswers}
        percentage={result.percentage}
        totalTime={result.totalTime}
      />
      <article className="w-full h-fit py-[1rem] mb-[2rem]">
        <h2 className="w-full h-[3rem] text-primary-4 font-bold leading-[calc(2rem+2px)] text-[1.25rem] border-b border-solid border-primary-4 mb-4">
          정답
        </h2>
        <ul className="w-full flex flex-col gap-[1rem] items-center relative">
          {questions.map((quiz, index) => {
            const userAnswerId =
              result.userAnswers[index] === 99
                ? '건너뛰기'
                : quiz.options[result.userAnswers[index]].id
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
                  <p className="w-1/5 h-6 flex justify-center">
                    <TagComponent type={quiz.targetType as PokemonType} />
                  </p>
                  <div className="w-2/5 h-[6rem] flex items-center justify-center drop-shadow-[1px_1px_1px_#333333]">
                    <ImageComponent
                      width="4rem"
                      height="4rem"
                      src={`${imageMode}/${realAnswerId}.webp`}
                      alt={`정답 포켓몬 ${quiz.options[quiz.correctAnswerIndex].koreanName}`}
                    />
                  </div>
                  {userAnswerId === '건너뛰기' ? (
                    <p className="w-2/5 h-[6rem] leading-[6rem] text-center text-[1.125rem]">
                      건너뛰기
                    </p>
                  ) : (
                    <div
                      className={`w-2/5 h-[6rem] flex items-center justify-center drop-shadow-[1px_1px_1px_#333333] ${userAnswerId === realAnswerId ? '' : 'opacity-60 grayscale'} relative`}
                    >
                      {userAnswerId === realAnswerId && (
                        <i className="w-4 h-4 block absolute top-0 right-4 z-10">
                          <CorrectIcon />
                        </i>
                      )}

                      <ImageComponent
                        width={userAnswerId === realAnswerId ? '5rem' : '4rem'}
                        height={userAnswerId === realAnswerId ? '5rem' : '4rem'}
                        src={`${imageMode}/${userAnswerId}.webp`}
                      />
                    </div>
                  )}
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
