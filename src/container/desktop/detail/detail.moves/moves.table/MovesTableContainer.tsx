'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import MoveDetailCard from '~/components/moves/moveCard/MoveDetailCard.component'
import { DetailMovesContext } from '~/context/DetailMoves.context'
import ToggleButtonComponent from './components/Toggle.component'

const MovesTableContainer = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const { pokemonLearnableData, versionGroup } = useContext(DetailMovesContext)

  const selectVersionParam = searchParams.get('selectVersion')
  const activeVersionId = `${
    selectVersionParam ?? versionGroup?.[0].versionGroupId.toString()
  }_${searchParams.get('activeIndex')}`

  // 현재 선택된 버전 그룹의 세대 ID 가져오기
  const currentGenerationId =
    versionGroup?.find((version) => {
      return (
        version.versionGroupId ===
        parseInt(
          selectVersionParam ?? versionGroup[0].versionGroupId.toString(),
          10,
        )
      )
    })?.generationId ??
    versionGroup?.[0].generationId ??
    9

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
    <section className="w-full h-fit">
      <header className="w-full h-20 pt-4 flex justify-between items-center border-b border-solid border-primary-3 bg-primary-1">
        <h2 className="h-12 leading-[3rem] text-[1.5rem] font-[500] text-primary-4">
          기술 목록
        </h2>
        <div className="w-[11rem] h-[3rem] flex-between">
          <p className="h-[1.25rem] text-[1rem] text-aligned-xs text-primary-4">
            습득 유형 :
          </p>
          <ToggleButtonComponent
            key={`toogle-status-${activeVersionId}-${defaultToggleStatus}`}
            defaultChecked={isToogleChecked}
            onClickToggle={handleClickCheckToggle}
          />
        </div>
      </header>
      <div className="w-full flex flex-col gap-6 py-6">
        {defaultToggleStatus === null || defaultToggleStatus === 'LEVELUP'
          ? pokemonLearnableData.levelUpSkills.map((move, index) => {
              const level =
                move.level === 0
                  ? '진화'
                  : move.level === 1
                    ? '최초'
                    : move.level

              return (
                <MoveDetailCard
                  key={`pokemon-levelup-move-${index}_${move.skill.id}`}
                  moveData={move.skill}
                  moveLevel={level}
                  generationId={currentGenerationId}
                />
              )
            })
          : null}
        {defaultToggleStatus === 'MACHINE'
          ? pokemonLearnableData.machineSkills.map((move, index) => {
              return (
                <MoveDetailCard
                  key={`pokemon-machine-move-${index}_${move.skill.id}`}
                  moveData={move.skill}
                  generationId={currentGenerationId}
                />
              )
            })
          : null}
      </div>
    </section>
  )
}

export default MovesTableContainer
