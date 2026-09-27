import DetailMovesTopBanner from '~/components/adSlot/DetailMovesTopBanner.component'
import DetailMovesHero from '~/containers/detail/moves/DetailMovesHero.container'
import DetailMovesList from '~/containers/detail/moves/DetailMovesList.container'
import DetailMovesStickyNav from '~/containers/detail/moves/DetailMovesStickyNav.container'

interface DetailMovesProps {
  pokemonName: string
}

const DetailMoves = ({ pokemonName }: DetailMovesProps) => {
  return (
    <>
      <h1 className="sr-only">{pokemonName} 상세 습득 기술 정보</h1>
      <div className="flex w-full flex-col gap-5 py-6 desktop:gap-6 desktop:py-8">
        <DetailMovesHero />
        <DetailMovesTopBanner />
        <DetailMovesStickyNav />
        <div className="w-full px-4 desktop:mx-auto desktop:max-w-7xl">
          <DetailMovesList />
        </div>
      </div>
    </>
  )
}

export default DetailMoves
