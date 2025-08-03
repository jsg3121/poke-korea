'use client'

import { useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import MoveTableRow from '~/components/moves/moveTableRow/MoveTableRow.component'
import { DetailMovesContext } from '~/context/DetailMoves.context'

const MovesTableContainer = () => {
  const searchParams = useSearchParams()
  const { pokemonLearnableData } = useContext(DetailMovesContext)

  const activeVersionId =
    searchParams.get('selectVersion') ??
    pokemonLearnableData[0].versionGroup?.versionGroupId.toString()

  const activeMoveList = pokemonLearnableData.find((movesData) => {
    return (
      movesData.versionGroup?.versionGroupId ===
      parseInt(activeVersionId || '', 10)
    )
  })

  return (
    <section className="w-full h-fit">
      <header className="w-full h-28 pt-4 flex justify-between border-b border-solid border-primary-3 flex-wrap sticky top-30 z-10 bg-primary-1">
        <h2 className="h-12 leading-[2rem] text-[1.5rem] font-[500] text-primary-4">
          기술 목록
        </h2>

        <div
          className="w-full h-12 border-b border-solid flex bg-primary-2 border-primary-1 [&>p]:h-12 [&>p]:leading-[3rem] [&>p]:font-[500]"
          aria-hidden
        >
          <p className="w-[5%] text-primary-4 text-center">레벨</p>
          <p className="w-[16%] text-primary-4 text-center">기술명</p>
          <p className="w-[53%] text-primary-4 text-center">설명</p>
          <p className="w-[6%] text-primary-4 text-center">타입</p>
          <p className="w-[4%] text-primary-4 text-center">위력</p>
          <p className="w-[5%] text-primary-4 text-center">명중률</p>
          <p className="w-[4%] text-primary-4 text-center">PP</p>
          <p className="w-[7%] text-primary-4 text-center">기술유형</p>
        </div>
      </header>
      <table className="w-full h-full bg-primary-4 border-hidden table-fixed">
        <colgroup>
          <col width="5%" />
          <col width="16%" />
          <col width="53%" />
          <col width="6%" />
          <col width="4%" />
          <col width="5%" />
          <col width="4%" />
          <col width="7%" />
        </colgroup>
        <thead className="visually-hidden">
          <tr>
            <th>배우는 레벨</th>
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
          {activeMoveList &&
            activeMoveList.levelUpSkills.map((move, index) => {
              const level =
                move.level === 0
                  ? '진화'
                  : move.level === 1
                    ? '최초'
                    : move.level

              return (
                <MoveTableRow
                  key={`pokemon-levelup-move-${index}_${move.skill.id}`}
                  moveData={move.skill}
                  moveLevel={level}
                />
              )
            })}
        </tbody>
      </table>
    </section>
  )
}

export default MovesTableContainer
