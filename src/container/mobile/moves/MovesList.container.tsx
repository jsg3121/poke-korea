import { useContext, useEffect, useRef } from 'react'
import { MovesContext } from '~/context/Moves.context'
import FooterContainer from '../footer/Footer.container'
import MoveCard from './moveCard/MoveCard.component'
import MovesFilter from './moves.filter/MovesFilter'

const MovesListContainer = () => {
  const listRef = useRef<HTMLDivElement>(null)
  const { skillList, hasNextPage, loading, totalCount, loadMore } =
    useContext(MovesContext)

  const observerCallback = (entries: Array<IntersectionObserverEntry>) => {
    entries.forEach((entry) => {
      const intersectionRatio = entry.intersectionRatio
      if (intersectionRatio > 0 && hasNextPage) {
        loadMore()
      }
    })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px 0px 380px 0px',
      threshold: 0,
    })

    if (listRef.current) {
      observer.observe(listRef.current)
    }
    return () => observer.disconnect()
  }, [skillList])

  return (
    <section className="w-full h-fit">
      <header className="w-full min-h-28 pt-4 flex justify-between border-b border-solid border-primary-3 flex-wrap sticky top-16 z-10 bg-primary-1">
        <h2 className="h-6 leading-[1.5rem] text-[1.25rem] font-[500] text-primary-4">
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
