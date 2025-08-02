import { useContext, useEffect, useRef } from 'react'
import { MovesContext } from '~/context/Moves.context'
import FooterContainer from '../footer/Footer.container'
import MoveCard from './moveCard/MoveCard.component'

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
      <header className="w-full h-28 pt-4 flex justify-between border-b border-solid border-primary-3 items-end flex-wrap sticky top-30 z-10 bg-primary-1">
        <h2 className="w-fit h-12 leading-[3rem] text-[1.5rem] font-[500] text-primary-4">
          기술 목록
        </h2>
        <p className="w-fit h-6 text-primary-4 leading-6 font-thin">
          총 <b className="font-[600]">{totalCount}</b>개의 기술을 볼 수 있어요!
        </p>
        <div
          className="w-full h-12 border-b border-solid flex bg-primary-4 border-primary-1 [&>p]:h-12 [&>p]:leading-[3rem] [&>p]:font-[500]"
          aria-hidden
        >
          <p className="w-[18%] text-center">기술명</p>
          <p className="w-[56%] text-center">설명</p>
          <p className="w-[6%] text-center">타입</p>
          <p className="w-[4%] text-center">위력</p>
          <p className="w-[5%] text-center">명중률</p>
          <p className="w-[4%] text-center">PP</p>
          <p className="w-[7%] text-center">기술타입</p>
        </div>
      </header>
      <table className="w-full h-full bg-primary-3 border-hidden table-fixed">
        <colgroup>
          <col width="18%" />
          <col width="56%" />
          <col width="6%" />
          <col width="4%" />
          <col width="5%" />
          <col width="4%" />
          <col width="7%" />
        </colgroup>
        <thead className="visually-hidden">
          <tr>
            <th>기술명</th>
            <th>설명</th>
            <th>기술타입</th>
            <th>타입</th>
            <th>위력</th>
            <th>명중률</th>
            <th>PP</th>
          </tr>
        </thead>
        <tbody>
          {skillList.map((skill) => (
            <MoveCard key={skill.id} moveData={skill} />
          ))}
        </tbody>
      </table>

      {loading && (
        <div className="text-center py-4">
          <p>로딩 중...</p>
        </div>
      )}
      {!hasNextPage && skillList.length > 0 && (
        <div className=" h-14 border-y border-solid border-primary-4 text-center py-4 bg-primary-3">
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
