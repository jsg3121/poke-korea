import MovesHeaderContainer from '~/container/desktop/detail/moves/MovesHeader.container'
import HeaderContainer from '~/container/desktop/header/Header.container'

interface DetailMovesDesktopProps {
  pokemonName: string
}

const DetailMovesDesktop = ({ pokemonName }: DetailMovesDesktopProps) => {
  return (
    <main className="w-full min-h-screen pt-30">
      <HeaderContainer />
      <section className="max-w-[1280px] mx-auto pt-4">
        <h1 className="visually-hidden">{pokemonName} 상세 습득 기술 정보</h1>
        <MovesHeaderContainer />
      </section>
    </main>
  )
}

export default DetailMovesDesktop
