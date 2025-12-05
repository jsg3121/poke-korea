import DesktopMovesTopBanner from '~/components/adSlot/DesktopMovesTopBanner'
import MovesSearchAndFilter from '~/components/moves/MovesSearchAndFilter.component'
import FooterContainer from '../footer/Footer.container'
import MovesList from './moves.list/MovesList'

const MovesListContainer = () => {
  return (
    <section className="w-full h-fit">
      <MovesSearchAndFilter />
      <DesktopMovesTopBanner />
      <MovesList />
      <FooterContainer />
    </section>
  )
}

export default MovesListContainer
