'use client'

import { Fragment, useContext } from 'react'
import MoveListCard from '~/components/moves/moveCard/MoveListCard.component'
import { MovesContext } from '~/context/Moves.context'
import { useInfiniteScroll } from '~/hook/useInfiniteScroll'

const MovesList = () => {
  const { skillList, hasNextPage, loading, loadMore } = useContext(MovesContext)

  const listRef = useInfiniteScroll({
    hasNextPage,
    loadMore,
    rootMargin: '0px 0px 380px 0px',
    dependencies: [skillList],
  })

  return (
    <Fragment>
      <header className="w-full h-6 px-4">
        <h2 className="h-6 leading-[1.5rem] text-xl font-[500] text-primary-4">
          기술 목록
        </h2>
      </header>
      {skillList.length === 0 && !loading && (
        <div className="w-full h-[20rem] flex-center">
          <p className="w-full text-xl text-primary-4 font-bold text-center px-4">
            검색하신 조건의 기술이 존재하지 않아요!
          </p>
        </div>
      )}
      {skillList.length > 0 && (
        <div className="flex flex-col gap-4 px-4 py-4">
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
      <div ref={listRef} />
    </Fragment>
  )
}

export default MovesList
