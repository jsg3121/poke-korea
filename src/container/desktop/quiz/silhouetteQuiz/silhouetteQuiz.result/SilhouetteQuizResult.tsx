import ImageComponent from '~/components/Image.component'
import { useSilhouetteQuizContext } from '~/context/SilhouetteQuiz.context'
import { imageMode } from '~/module/buildMode'
import { getTextSize } from '~/module/getTextSize.module'
import { getQuizResultCopy } from '~/module/quiz.module'
import ResultFooter from '../../components/result/ResultFooter'
import ResultHeader from '../../components/result/ResultHeader'
import ResultSummary from '../../components/result/ResultSummary'
import DesktopSilhouetteResultTopBanner from '~/components/adSlot/DesktopSilhouetteResultTopBanner'

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
    <section className="min-h-[60rem] w-full max-w-[1280px] mx-auto pt-[3rem]">
      <ResultHeader headline={headline} medal={medal} subcopy={subcopy} />
      <ResultSummary
        averageTime={result.averageTime}
        correctAnswers={result.correctAnswers}
        percentage={result.percentage}
        totalTime={result.totalTime}
      />
      <DesktopSilhouetteResultTopBanner />
      <article className="w-full h-fit bg-primary-4 rounded-[2rem] py-[1rem] px-[2rem] mb-[2rem]">
        <h2 className="w-full h-[3rem] text-primary-1 font-bold text-aligned-base text-xl">
          문제 정답
        </h2>
        <ul className="w-full h-52 flex-items-gap-4 overflow-x-auto relative [&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:h-[10px] [&::-webkit-scrollbar-thumb]:bg-primary-2 [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-track]:bg-primary-3 [&::-webkit-scrollbar-track]:rounded-xl">
          <li className="w-24 h-44 shrink-0 flex flex-col items-center bg-primary-1 sticky left-0 z-20 rounded-[1rem]">
            <p className="w-full h-24 text-sm text-primary-4 text-center leading-[calc(5rem+2px)]">
              문제 포켓몬
            </p>
            <p className="w-full h-10 text-sm text-primary-4 text-center text-aligned-base">
              정답
            </p>
            <p className="w-full h-10 text-sm text-primary-4 text-center text-aligned-base">
              나의 답
            </p>
          </li>
          {questions.map((quiz, index) => {
            const userAnswer =
              result.userAnswers[index] === 99
                ? '건너뛰기'
                : quiz.options[result.userAnswers[index]]
            const realAnswer = quiz.options[quiz.correctAnswerIndex]

            const userAnswerTextSize = getTextSize(userAnswer)
            const realAnswerTextSize = getTextSize(realAnswer)

            return (
              <li
                key={quiz.id}
                className="w-24 h-44 shrink-0 flex flex-col items-center justify-between"
              >
                <i className="h-24">
                  <ImageComponent
                    width="5rem"
                    height="5rem"
                    src={`${imageMode}/${quiz.correctPokemonId}.webp`}
                    alt={`정답 포켓몬 ${realAnswer}`}
                    imageSize={{ width: 80, height: 80 }}
                    densities={[1, 1.5]}
                    sizes="5rem"
                    loading="lazy"
                  />
                </i>
                <p
                  className={`w-full h-10 text-center text-aligned-lg text-primary-1 ${userAnswerTextSize === 'small' ? 'text-xs' : 'text-base'}`}
                >
                  {realAnswer}
                </p>
                <p
                  className={`w-full h-10 text-center text-aligned-lg relative ${realAnswerTextSize === 'small' ? 'text-xs' : 'text-base'} ${realAnswer === userAnswer ? 'font-bold text-green-700' : 'text-red-700'}`}
                >
                  {userAnswer}
                </p>
              </li>
            )
          })}
        </ul>
      </article>
      <ResultFooter onClickRetryButton={handleClickRetryQuiz} />
    </section>
  )
}

export default SilhouetteQuizResult
