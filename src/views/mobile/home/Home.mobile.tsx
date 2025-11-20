import HeaderContainer from '~/container/mobile/header/Header.container'
import { DailyQuizPreview, PokemonCardFragment } from '~/graphql/typeGenerated'
interface HomeMobileProps {
  dailyPokemon: Array<PokemonCardFragment>
  dailyQuiz?: DailyQuizPreview
}

const HomeMobile = ({ dailyPokemon, dailyQuiz }: HomeMobileProps) => {
  return (
    <main className="w-full min-h-screen">
      <HeaderContainer />
    </main>
  )
}

export default HomeMobile
