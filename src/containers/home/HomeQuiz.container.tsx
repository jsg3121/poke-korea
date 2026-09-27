import { DailyQuizPreview } from '~/graphql/typeGenerated'
import LinkButton from '~/components/button/LinkButton.component'
import SectionHeading from '~/components/SectionHeading.component'

import AbilityQuizCard from './quiz/AbilityQuizCard.container'
import PokemonTypeQuizCard from './quiz/PokemonTypeQuizCard.container'
import SilhouetteQuizCard from './quiz/SilhouetteQuizCard.container'

interface HomeQuizProps {
  dailyQuiz: DailyQuizPreview
}

const HomeQuiz = ({ dailyQuiz }: HomeQuizProps) => {
  return (
    <section
      className="w-full px-4 desktop:px-8"
      aria-labelledby="daily-quiz-heading"
    >
      <SectionHeading id="daily-quiz-heading">오늘의 퀴즈</SectionHeading>

      <div className="mt-4 grid grid-cols-1 desktop:grid-cols-3 gap-6">
        <SilhouetteQuizCard silhouetteQuiz={dailyQuiz.silhouetteQuiz} />
        <AbilityQuizCard abilityQuiz={dailyQuiz.abilityQuiz} />
        <PokemonTypeQuizCard pokemonTypeQuiz={dailyQuiz.typeQuiz} />
      </div>

      <div className="mt-6 flex justify-center">
        <LinkButton href="/quiz" variant="secondary" showArrow>
          퀴즈 더 풀어보기
        </LinkButton>
      </div>
    </section>
  )
}

export default HomeQuiz
