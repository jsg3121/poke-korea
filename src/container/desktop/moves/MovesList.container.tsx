'use client'
import { useContext, useEffect, useRef } from 'react'
import { MovesContext } from '~/context/Moves.context'
import MoveCard from './moveCard/MoveCard.component'
import FooterContainer from '../footer/Footer.container'

const MovesListContainer = () => {
  const listRef = useRef<HTMLDivElement>(null)
  const { skillList, hasNextPage, loading, totalCount, loadMore } =
    useContext(MovesContext)

  const observerCallback = (entries: Array<IntersectionObserverEntry>) => {
    entries.forEach((entry) => {
      const intersectionRatio = entry.intersectionRatio
      if (intersectionRatio > 0) {
        loadMore()
      }
    })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px 0px 200px 0px',
      threshold: 0,
    })

    if (listRef.current) {
      observer.observe(listRef.current)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <section>
      <div>
        <h2>기술 목록</h2>
        <p>총 {totalCount}개의 기술</p>
      </div>
      <div className="h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skillList.map((skill) => (
          <MoveCard key={skill.name} moveData={skill} />
        ))}
      </div>
      {loading && (
        <div className="text-center py-4">
          <p>로딩 중...</p>
        </div>
      )}
      {!hasNextPage && skillList.length > 0 && (
        <div className="text-center py-4">
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
