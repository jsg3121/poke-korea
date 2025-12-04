import { useContext } from 'react'
import { MovesContext } from '~/context/Moves.context'
import { useInfiniteScroll } from '~/hook/useInfiniteScroll'
import FooterContainer from '../footer/Footer.container'
import MoveListCard from '~/components/moves/moveCard/MoveListCard.component'
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
      <header className="w-full min-h-8 pt-4 pb-4">
        <h2 className="h-6 leading-[1.5rem] text-[1.25rem] font-[500] text-primary-4 sr-only">
          기술 목록
        </h2>
      </header>

      {skillList.length === 0 && !loading && (
        <div className="w-full h-[20rem] flex items-center justify-center">
          <p className="w-full text-xl text-primary-4 font-bold text-center px-4">
            검색하신 조건의 기술이 존재하지 않아요!
          </p>
        </div>
      )}

      {skillList.length > 0 && (
        <div className="flex flex-col gap-4 px-2 py-4">
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
