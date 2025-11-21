import { useContext } from 'react'
import { MovesContext } from '~/context/Moves.context'
import { useInfiniteScroll } from '~/hook/useInfiniteScroll'
import FooterContainer from '../footer/Footer.container'
import MovesFilter from './moves.filter/MovesFilter'
import MoveTableRow from '~/components/moves/moveTableRow/MoveTableRow.component'
import DesktopMovesTopBanner from '~/components/adSlot/DesktopMovesTopBanner'

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
      <DesktopMovesTopBanner />
      <header className="w-full min-h-28 pt-3 flex justify-between border-b border-solid border-primary-3 flex-wrap sticky top-30 z-10 bg-primary-1">
        <h2 className="h-8 leading-[2rem] text-[1.5rem] font-[500] text-primary-4">
          기술 목록
        </h2>
        <MovesFilter totalCount={totalCount} />
        <div
          className="w-full h-12 border-b border-solid flex bg-primary-2 border-primary-1 [&>p]:h-12 [&>p]:leading-[3rem] [&>p]:font-[500]"
          aria-hidden
        >
          <p className="w-[18%] text-primary-4 text-center">기술명</p>
          <p className="w-[56%] text-primary-4 text-center">설명</p>
          <p className="w-[6%] text-primary-4 text-center">타입</p>
          <p className="w-[4%] text-primary-4 text-center">위력</p>
          <p className="w-[5%] text-primary-4 text-center">명중률</p>
          <p className="w-[4%] text-primary-4 text-center">PP</p>
          <p className="w-[7%] text-primary-4 text-center">기술유형</p>
        </div>
      </header>
      <table className="w-full h-full bg-primary-4 border-hidden table-fixed">
        <colgroup>
          <col width="18%" />
          <col width="56%" />
          <col width="6%" />
          <col width="4%" />
          <col width="5%" />
          <col width="4%" />
          <col width="7%" />
        </colgroup>
        <thead className="sr-only">
          <tr>
            <th>기술명</th>
            <th>설명</th>
            <th>타입</th>
            <th>위력</th>
            <th>명중률</th>
            <th>PP</th>
            <th>기술유형</th>
          </tr>
        </thead>
        <tbody>
          {skillList.map((skill) => (
            <MoveTableRow key={skill.id} moveData={skill} />
          ))}
        </tbody>
      </table>
      {loading && (
        <div className="h-14 border-y border-solid border-primary-3 text-center py-4 bg-primary-3">
          <p>로딩 중...</p>
        </div>
      )}
      {!loading && !hasNextPage && skillList.length > 0 && (
        <div className="h-14 border-y border-solid border-primary-3 text-center py-4 bg-primary-3">
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
