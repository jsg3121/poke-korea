import { useContext } from 'react'
import { MovesContext } from '~/context/Moves.context'
import { useInfiniteScroll } from '~/hook/useInfiniteScroll'
import FooterContainer from '../footer/Footer.container'
import MoveListCard from '~/components/moves/moveCard/MoveListCard.component'
import DesktopMovesTopBanner from '~/components/adSlot/DesktopMovesTopBanner'
import MovesSearchAndFilter from '~/components/moves/MovesSearchAndFilter.component'

const MovesListContainer = () => {
  const { skillList, hasNextPage, loading, totalCount, loadMore } =
    useContext(MovesContext)

  const listRef = useInfiniteScroll({
    hasNextPage,
    loadMore,
    rootMargin: '0px 0px 380px 0px',
    dependencies: [skillList],
  })

  return (
    <section className="w-full h-fit">
      <MovesSearchAndFilter totalCount={totalCount} />
      <DesktopMovesTopBanner />
      <header className="w-full pt-3 pb-4">
        <h2 className="h-8 leading-[2rem] text-[1.5rem] font-[500] text-primary-4">
          기술 목록
        </h2>
      </header>

      {skillList.length === 0 && !loading && (
        <div className="w-full h-[20rem] flex items-center justify-center">
          <p className="w-full text-2xl text-primary-4 font-bold text-center">
            검색하신 조건의 기술이 존재하지 않아요!
          </p>
        </div>
      )}

      {skillList.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 px-1 py-6">
          {skillList.map((skill) => (
            <MoveListCard key={skill.id} moveData={skill} />
          ))}
        </div>
      )}

      {loading && (
        <div className="h-14 text-center py-4">
          <p className="text-primary-4">로딩 중...</p>
        </div>
      )}

      <div ref={listRef}>
        <FooterContainer />
      </div>
    </section>
  )
}

export default MovesListContainer
