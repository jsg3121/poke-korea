'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import MoveCard from '~/components/moves/moveCard/MoveCard.component'
import { DetailMovesContext } from '~/context/DetailMoves.context'
import ToggleButtonComponent from './components/Toggle.component'

const MovesTableContainer = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const { pokemonLearnableData, versionGroup } = useContext(DetailMovesContext)

  const activeVersionId = `${
    searchParams.get('selectVersion') ??
    versionGroup?.[0].versionGroupId.toString()
  }_${searchParams.get('activeIndex')}`

  const defaultToggleStatus = searchParams.get('movesType')
  const isToogleChecked = defaultToggleStatus === 'MACHINE' ? false : true

  const handleClickCheckToggle = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('movesType', value)
    router.replace(`${pathname}?${params.toString()}`)
  }

  if (!pokemonLearnableData) {
    return
  }

  return (
    <section className="w-full h-fit px-4">
      <header className="w-full h-[4rem] pt-4 flex items-center justify-between border-b border-solid border-primary-3 flex-wrap sticky top-[4rem] z-10 bg-primary-1 mb-3">
        <h2 className="h-12 leading-[3rem] text-[1.5rem] font-[500] text-primary-4">
          기술 목록
        </h2>
        <div className="w-[11rem] h-[3rem] flex items-center justify-between">
          <p className="h-[1.25rem] text-[1rem] leading-[calc(1.25rem+2px)] text-primary-4">
            습득 유형 :
          </p>
          <ToggleButtonComponent
            key={`toogle-status-${activeVersionId}-${defaultToggleStatus}`}
            defaultChecked={isToogleChecked}
            onClickToggle={handleClickCheckToggle}
          />
        </div>
      </header>
      {defaultToggleStatus === null || defaultToggleStatus === 'LEVELUP' ? (
        pokemonLearnableData.levelUpSkills.map((move, index) => {
          const level =
            move.level === 0 ? '진화' : move.level === 1 ? '최초' : move.level

          return (
            <MoveCard
              key={`pokemon-levelup-move-${index}_${move.skill.id}`}
              moveData={move.skill}
              moveLevel={level}
            />
          )
        })
      ) : (
        <></>
      )}
      {defaultToggleStatus === 'MACHINE' ? (
        pokemonLearnableData.machineSkills.map((move, index) => {
          return (
            <MoveCard
              key={`pokemon-machine-move-${index}_${move.skill.id}`}
              moveData={move.skill}
            />
          )
        })
      ) : (
        <></>
      )}
    </section>
  )
}

export default MovesTableContainer
