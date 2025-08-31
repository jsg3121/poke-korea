import DesktopDetailMovesBanner from '~/components/adSlot/DesktopDetailMovesBanner'
import MovesHeaderContainer from '~/container/desktop/detail/detail.moves/moves.header/MovesHeader.container'
import MovesTableContainer from '~/container/desktop/detail/detail.moves/moves.table/MovesTableContainer'
import FooterContainer from '~/container/desktop/footer/Footer.container'
import HeaderContainer from '~/container/desktop/header/Header.container'

interface DetailMovesDesktopProps {
  pokemonName: string
}

const DetailMovesDesktop = ({ pokemonName }: DetailMovesDesktopProps) => {
  return (
    <main className="w-full max-w-[1280px] mx-auto min-h-screen pt-30">
      <HeaderContainer />
      <section className="w-full pt-4 mb-4">
        <h1 className="sr-only">{pokemonName} 상세 습득 기술 정보</h1>
        <MovesHeaderContainer pokemonName={pokemonName} />
      </section>
      <DesktopDetailMovesBanner />
      <MovesTableContainer />
      <FooterContainer />
    </main>
  )
}

export default DetailMovesDesktop
