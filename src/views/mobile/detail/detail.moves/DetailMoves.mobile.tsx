import MobileDetailMovesBanner from '~/components/adSlot/MobileDetailMovesBanner'
import MovesHeaderContainer from '~/container/mobile/detail/detail.moves/moves.header/MovesHeader.container'
import MovesTableContainer from '~/container/mobile/detail/detail.moves/moves.table/MovesTableContainer'
import HeaderContainer from '~/container/mobile/header/Header.container'

interface DetailMovesMobileProps {
  pokemonName: string
}

const DetailMovesMobile = ({ pokemonName }: DetailMovesMobileProps) => {
  return (
    <main className="w-full mx-auto min-h-screen">
      <HeaderContainer />
      <section className="w-full p-4">
        <h1 className="sr-only">{pokemonName} 상세 습득 기술 정보</h1>
        <MovesHeaderContainer pokemonName={pokemonName} />
      </section>
      <MobileDetailMovesBanner />
      <MovesTableContainer />
    </main>
  )
}

export default DetailMovesMobile
