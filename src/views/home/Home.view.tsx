import { ReactNode } from 'react'

import {
  ChampionsMetaSummaryFragment,
  DailyQuizPreview,
  PokemonCardFragment,
} from '~/graphql/typeGenerated'
import HomeChampions from '~/containers/home/HomeChampions.container'
import HomeDailyPokemon from '~/containers/home/HomeDailyPokemon.container'
import HomeHubLinks from '~/containers/home/HomeHubLinks.container'
import HomeQuiz from '~/containers/home/HomeQuiz.container'

interface HomeProps {
  dailyPokemon: Array<PokemonCardFragment>
  dailyQuiz: DailyQuizPreview
  topChampionsPokemons: Array<ChampionsMetaSummaryFragment>
  topBanner: ReactNode
  bottomBanner: ReactNode
}

const Home = ({
  dailyPokemon,
  dailyQuiz,
  topChampionsPokemons,
  topBanner,
  bottomBanner,
}: HomeProps) => {
  return (
    <div className="w-full flex flex-col gap-8 py-6 desktop:gap-10 desktop:py-10">
      <h1 className="sr-only">포켓몬의 모든 정보 Poke Korea</h1>

      <HomeChampions topPokemons={topChampionsPokemons} />
      <HomeHubLinks />
      {topBanner}
      <HomeDailyPokemon dailyPokemon={dailyPokemon} />
      <HomeQuiz dailyQuiz={dailyQuiz} />
      {bottomBanner}
    </div>
  )
}

export default Home
