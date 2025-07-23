'use client'
import { useContext, useEffect, useCallback } from 'react'
import { MovesContext } from '~/context/Moves.context'
import MoveCard from './moveCard/MoveCard.component'

const MovesListContainer = () => {
  const { skillList, hasNextPage, loading, loadMore, totalCount } =
    useContext(MovesContext)

  const handleScroll = useCallback(() => {
    if (hasNextPage && !loading) {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        loadMore()
      }
    }
  }, [hasNextPage, loading, loadMore])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <section>
      <div>
        <h2>기술 목록</h2>
        <p>총 {totalCount}개의 기술</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skillList.map((skill) => (
          <MoveCard key={skill.id} moveData={skill} />
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
    </section>
  )
}

export default MovesListContainer
