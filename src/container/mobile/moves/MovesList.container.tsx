import { useContext } from 'react'
import { MovesContext } from '~/context/Moves.context'
import { useInfiniteScroll } from '~/hook/useInfiniteScroll'
import FooterContainer from '../footer/Footer.container'
import MovesFilter from './moves.filter/MovesFilter'
import MoveCard from '~/components/moves/moveCard/MoveCard.component'

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
      <header className="w-full min-h-8 pt-4 border-b border-solid border-primary-3 flex-wrap sticky top-16 z-10 bg-primary-1 mb-2">
        <h2 className="h-6 leading-[1.5rem] text-[1.25rem] font-[500] text-primary-4 sr-only">
          기술 목록
        </h2>
        <MovesFilter totalCount={totalCount} />
      </header>
      {skillList.map((skill) => (
        <MoveCard key={skill.id} moveData={skill} />
      ))}
      {loading && (
        <div className="h-14 border-y border-solid border-primary-4 text-center py-4 bg-primary-3">
          <p>로딩 중...</p>
        </div>
      )}
      {!loading && !hasNextPage && skillList.length > 0 && (
        <div className="h-14 border-y border-solid border-primary-4 text-center py-4 bg-primary-3">
          <p>모든 기술을 불러왔습니다.</p>
        </div>
      )}
      <div ref={listRef}>
        <FooterContainer />
      </div>
    </section>
  )
}

export default MovesListContainer
