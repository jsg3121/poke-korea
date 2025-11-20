import { Fragment } from 'react'
import { DailyQuizPreview } from '~/graphql/typeGenerated'
import AbilityQuizCardContainer from './quiz.quizCard/AbilityQuizCard.container'
import SilhouetteQuizCardCntainer from './quiz.quizCard/SilhouetteQuizCard.cntainer'
import PokemonTypeQuizCardContainer from './quiz.quizCard/PokemonTypeQuizCard.container'

interface HomeQuizContaierProps {
  dailyQuiz: DailyQuizPreview
}

const HomeQuizContaier = ({ dailyQuiz }: HomeQuizContaierProps) => {
  return (
    <Fragment>
      <section
        className="w-full px-5 mx-auto"
        aria-labelledby="daily-quiz-heading"
      >
        <h2
          id="daily-quiz-heading"
          className="h-12 text-[2.5rem] font-bold text-primary-4 text-center mb-12"
        >
          오늘의 퀴즈
        </h2>
        <div className="grid grid-rows-3 gap-6">
          <SilhouetteQuizCardCntainer
            silhouetteQuiz={dailyQuiz.silhouetteQuiz}
          />
          <AbilityQuizCardContainer abilityQuiz={dailyQuiz.abilityQuiz} />
          <PokemonTypeQuizCardContainer pokemonTypeQuiz={dailyQuiz.typeQuiz} />
        </div>
      </section>
    </Fragment>
  )
}

export default HomeQuizContaier
