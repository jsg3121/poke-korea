import CorrectIcon from '~/assets/icons/correct-icon.svg'
import ImageComponent from '~/components/Image.component'
import { useSilhouetteQuizContext } from '~/context/SilhouetteQuiz.context'
import { imageMode } from '~/module/buildMode'
import { getQuizResultCopy } from '~/module/quiz.module'
import ResultFooter from '../../components/result/ResultFooter'
import ResultHeader from '../../components/result/ResultHeader'
import ResultSummary from '../../components/result/ResultSummary'

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
            const userAnswer =
              result.userAnswers[index] === 99
                ? '건너뛰기'
                : quiz.options[result.userAnswers[index]]
            const realAnswer = quiz.options[quiz.correctAnswerIndex]

            return (
              <li
                key={quiz.id}
                className="w-full h-50 flex flex-wrap gap-x-4 justify-between bg-primary-4 rounded-[1rem] p-4"
              >
                <div className="w-1/2 h-32 flex flex-col items-start justify-start">
                  <span className="w-full text-primary-1 font-bold flex items-center gap-2 [&>svg]:w-[1.5rem] [&>svg]:h-[1.5rem] mb-4">
                    #{index + 1}{' '}
                    {userAnswer === realAnswer && (
                      <>
                        정답! <CorrectIcon />
                      </>
                    )}
                  </span>
                  <p className="w-fit h-6 text-left text-[1rem] text-primary-1">
                    정답 :{' '}
                    <span className="font-bold text-[1.125rem]">
                      {realAnswer}
                    </span>
                  </p>
                  <p
                    className={`w-fit h-6 shrink-0 text-left flex items-center gap-2 text-primary-1`}
                  >
                    나의 답 :{' '}
                    <span
                      className={`${userAnswer === realAnswer ? 'font-bold text-green-700' : 'text-red-700'}`}
                    >
                      {userAnswer}
                    </span>
                  </p>
                </div>
                <i className="w-32 h-32 shrink-0">
                  <ImageComponent
                    width="8rem"
                    height="8rem"
                    src={`${imageMode}/${quiz.correctPokemonId}.webp`}
                    alt={`정답 포켓몬 ${realAnswer}`}
                  />
                </i>
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
