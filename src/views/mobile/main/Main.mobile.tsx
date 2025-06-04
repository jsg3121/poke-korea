import MobileListTopBanner from '~/components/adSlot/MobileListTopBanner'
import ListContainer from '~/container/mobile/list/List.container'
import { ListProvider } from '~/context/List.context'
import { PokemonList } from '~/graphql/typeGenerated'
import HeaderContainer from './header/Header.container'

interface ManinViewsProps {
  pokemonList: Array<PokemonList>
}

const MainMobile = ({ pokemonList }: ManinViewsProps) => {
  return (
    <ListProvider pokemonList={pokemonList}>
      <HeaderContainer />
      <MobileListTopBanner />
      <ListContainer />
    </ListProvider>
  )
}

export default MainMobile
