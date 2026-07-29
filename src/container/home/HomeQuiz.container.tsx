import LinkButtonComponent from '~/components/button/LinkButton.component'
import SectionHeadingComponent from '~/components/SectionHeading.component'
import { DailyQuizPreview } from '~/graphql/typeGenerated'
import AbilityQuizCardContainer from './quiz/AbilityQuizCard.container'
import PokemonTypeQuizCardContainer from './quiz/PokemonTypeQuizCard.container'
import SilhouetteQuizCardContainer from './quiz/SilhouetteQuizCard.container'

/**
 * 홈 "오늘의 퀴즈" 섹션 (반응형 단일, DS 컴포넌트 조립).
 * 기존 desktop/mobile 2벌 컨테이너를 대체한다.
 *
 * - SectionHeading + QuizCard ×3 (실루엣/특성/타입).
 * - 데스크톱 3열(grid-cols-3) / 모바일 1열(세로 스택).
 * - 모바일 좌우 여백(gutter)은 표준 px-5(20px).
 * - 각 퀴즈 카드는 QuizCard DS 셸 + useCorrectQuizCheck 로직.
 */

interface HomeQuizContainerProps {
  dailyQuiz: DailyQuizPreview
}

const HomeQuizContainer = ({ dailyQuiz }: HomeQuizContainerProps) => {
  return (
    <section
      className="w-full px-4 desktop:px-8"
      aria-labelledby="daily-quiz-heading"
    >
      <SectionHeadingComponent id="daily-quiz-heading">
        오늘의 퀴즈
      </SectionHeadingComponent>

      <div className="mt-4 grid grid-cols-1 desktop:grid-cols-3 gap-6">
        <SilhouetteQuizCardContainer
          silhouetteQuiz={dailyQuiz.silhouetteQuiz}
        />
        <AbilityQuizCardContainer abilityQuiz={dailyQuiz.abilityQuiz} />
        <PokemonTypeQuizCardContainer pokemonTypeQuiz={dailyQuiz.typeQuiz} />
      </div>

      {/* 재방문 훅 승격(UX-003) — 오늘 푼 퀴즈 외에 더 있다는 동선 제공 */}
      <div className="mt-6 flex justify-center">
        <LinkButtonComponent href="/quiz" variant="secondary" showArrow>
          퀴즈 더 풀어보기
        </LinkButtonComponent>
      </div>
    </section>
  )
}

export default HomeQuizContainer
