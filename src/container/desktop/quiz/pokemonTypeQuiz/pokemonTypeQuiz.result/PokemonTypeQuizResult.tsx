'use client'

import CorrectIcon from '~/assets/icons/correct-icon.svg'
import ImageComponent from '~/components/Image.component'
import TagComponent from '~/components/Tag.component'
import { usePokemonTypeQuizContext } from '~/context/PokemonTypeQuiz.context'
import { PokemonType } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import { getQuizResultCopy } from '~/module/quiz.module'
import ResultFooter from '../../components/result/ResultFooter'
import ResultHeader from '../../components/result/ResultHeader'
import ResultSummary from '../../components/result/ResultSummary'
import DesktopPokemonTypeResultTopBanner from '~/components/adSlot/DesktopPokemonTypeResultTopBanner'

const PokemonTypeQuizResult = () => {
  const { result, questions, onClickRetryQuiz } = usePokemonTypeQuizContext()

  const { headline, medal, subcopy } = getQuizResultCopy(result?.score || 0)

  const handleClickRetryQuiz = () => {
    onClickRetryQuiz()
  }

  if (!result) return null

  return (
    <section className="h-fit w-full max-w-[1280px] mx-auto pt-[3rem]">
      <ResultHeader headline={headline} medal={medal} subcopy={subcopy} />
      <ResultSummary
        averageTime={result.averageTime}
        correctAnswers={result.correctAnswers}
        percentage={result.percentage}
        totalTime={result.totalTime}
      />
      <DesktopPokemonTypeResultTopBanner />
      <article className="w-full h-fit bg-primary-4 rounded-[2rem] py-[1rem] px-[2rem] mb-[2rem]">
        <h2 className="w-full h-[3rem] text-primary-1 font-bold text-aligned-base text-xl">
          문제 정답
        </h2>
        <ul className="w-full h-52 flex-items-gap-4 overflow-x-auto relative [&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:h-[10px] [&::-webkit-scrollbar-thumb]:bg-primary-2 [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-track]:bg-primary-3 [&::-webkit-scrollbar-track]:rounded-xl">
          <li className="w-24 h-48 shrink-0 flex flex-col items-center bg-primary-1 sticky left-0 z-10 rounded-[1rem]">
            <p className="w-full h-12 text-base text-primary-4 text-center text-aligned-xl">
              문제 타입
            </p>
            <p className="w-full h-[4.5rem] text-sm text-primary-4 text-center leading-[calc(4.5rem+2px)]">
              정답
            </p>
            <p className="w-full h-[4.5rem] text-sm text-primary-4 text-center leading-[calc(4.5rem+2px)]">
              나의 답
            </p>
          </li>
          {questions.map((quiz, index) => {
            const userAnswerId =
              result.userAnswers[index] === 99
                ? '건너뛰기'
                : quiz.options[result.userAnswers[index]].id
            const realAnswerId = quiz.options[quiz.correctAnswerIndex].id

            return (
              <li key={quiz.id} className="w-20 h-34 shrink-0">
                <p className="w-20 h-12 flex items-center">
                  <TagComponent type={quiz.targetType as PokemonType} />
                </p>
                <div className="w-[4.5rem] h-[4.5rem] flex-center drop-shadow-[1px_1px_1px_#333333]">
                  <ImageComponent
                    width="3rem"
                    height="3rem"
                    src={`${imageMode}/${realAnswerId}.webp`}
                  />
                </div>
                {userAnswerId === '건너뛰기' ? (
                  <p className="w-[4.5rem] h-[4.5rem] leading-[4.5rem]">
                    건너뛰기
                  </p>
                ) : (
                  <div
                    className={`w-[4.5rem] h-[4.5rem] flex-center drop-shadow-[1px_1px_1px_#333333] ${userAnswerId === realAnswerId ? '' : 'opacity-70 grayscale'} relative`}
                  >
                    {userAnswerId === realAnswerId && (
                      <i className="w-4 h-4 block absolute top-0 right-0 z-10">
                        <CorrectIcon />
                      </i>
                    )}
                    <ImageComponent
                      width={userAnswerId === realAnswerId ? '4rem' : '3rem'}
                      height={userAnswerId === realAnswerId ? '4rem' : '3rem'}
                      src={`${imageMode}/${userAnswerId}.webp?w=80&h=80`}
                    />
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </article>
      <ResultFooter onClickRetryButton={handleClickRetryQuiz} />
    </section>
  )
}

export default PokemonTypeQuizResult
