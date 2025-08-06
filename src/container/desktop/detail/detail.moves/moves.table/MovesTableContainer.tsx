'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import MoveTableRow from '~/components/moves/moveTableRow/MoveTableRow.component'
import { DetailMovesContext } from '~/context/DetailMoves.context'
import ToggleButtonComponent from './components/Toggle.component'

const MovesTableContainer = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const { pokemonLearnableData, versionGroup } = useContext(DetailMovesContext)

  const activeVersionId =
    searchParams.get('selectVersion') ??
    versionGroup?.[0].versionGroupId.toString()

  const defaultToggleStatus =
    searchParams.get('movesType') === 'MACHINE' ? false : true

  const handleClickCheckToggle = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('movesType', value)
    router.replace(`${pathname}?${params.toString()}`)
  }

  if (!pokemonLearnableData) {
    return
  }

  return (
    <section className="w-full h-fit">
      <header className="w-full h-28 pt-4 flex justify-between border-b border-solid border-primary-3 flex-wrap sticky top-30 z-10 bg-primary-1">
        <h2 className="h-12 leading-[2rem] text-[1.5rem] font-[500] text-primary-4">
          기술 목록
        </h2>
        <div className="w-[11rem] h-[3rem] flex items-center justify-between">
          <p className="h-[1.25rem] text-[1rem] leading-[calc(1.25rem+2px)] text-primary-4">
            습득 유형 :
          </p>
          <ToggleButtonComponent
            key={`toogle-status-${activeVersionId}`}
            defaultChecked={defaultToggleStatus}
            onClickToggle={handleClickCheckToggle}
          />
        </div>
        <div
          className="w-full h-12 border-b border-solid flex bg-primary-2 border-primary-1 [&>p]:h-12 [&>p]:leading-[3rem] [&>p]:font-[500]"
          aria-hidden
        >
          {defaultToggleStatus && (
            <p className="w-[5%] text-primary-4 text-center">레벨</p>
          )}
          <p
            className={`${defaultToggleStatus ? 'w-[16%]' : 'w-[18%]'} text-primary-4 text-center`}
          >
            기술명
          </p>
          <p
            className={`${defaultToggleStatus ? 'w-[53%]' : 'w-[56%]'} text-primary-4 text-center`}
          >
            설명
          </p>
          <p className="w-[6%] text-primary-4 text-center">타입</p>
          <p className="w-[4%] text-primary-4 text-center">위력</p>
          <p className="w-[5%] text-primary-4 text-center">명중률</p>
          <p className="w-[4%] text-primary-4 text-center">PP</p>
          <p className="w-[7%] text-primary-4 text-center">기술유형</p>
        </div>
      </header>
      <table className="w-full h-full bg-primary-4 border-hidden table-fixed">
        <colgroup>
          {defaultToggleStatus && <col width="5%" />}
          <col width={defaultToggleStatus ? '16%' : '18%'} />
          <col width={defaultToggleStatus ? '53%' : '56%'} />
          <col width="6%" />
          <col width="4%" />
          <col width="5%" />
          <col width="4%" />
          <col width="7%" />
        </colgroup>
        <thead className="visually-hidden">
          <tr>
            {defaultToggleStatus && <th>배우는 레벨</th>}
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
          {defaultToggleStatus
            ? pokemonLearnableData.levelUpSkills.map((move, index) => {
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
              })
            : pokemonLearnableData.machineSkills.map((move, index) => {
                return (
                  <MoveTableRow
                    key={`pokemon-levelup-move-${index}_${move.skill.id}`}
                    moveData={move.skill}
                  />
                )
              })}
        </tbody>
      </table>
    </section>
  )
}

export default MovesTableContainer
