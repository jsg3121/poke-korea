'use client'

import { Fragment, useState } from 'react'
import { VersionGroup } from '~/graphql/typeGenerated'
import { PokemonTypes } from '~/types/pokemonTypes.types'

interface OptionsDesktopProps {
  selectTypeFilter: string
  selectDamageTypes: string
  selectVersionGroupId: string
  selectFirstGenerationId: string
  versionGroups: Array<VersionGroup>
  onClickSelectTypeFilter: (types: string) => void
  onClickSelectDamageTypeFilter: (damageTypes: string) => void
  onClickSelectVersionGroupId: (id: string) => void
  onClickSelectFirstGenerationId: (id: string) => void
}

const OptionsDesktop = ({
  selectTypeFilter,
  selectDamageTypes,
  selectVersionGroupId,
  selectFirstGenerationId,
  versionGroups,
  onClickSelectDamageTypeFilter,
  onClickSelectTypeFilter,
  onClickSelectVersionGroupId,
  onClickSelectFirstGenerationId,
}: OptionsDesktopProps) => {
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false)

  const handleClickSelectTypeFilter = (types: string) => () => {
    onClickSelectTypeFilter(types)
  }
  const handleClickSelectDamageTypeFilter = (damageTypes: string) => () => {
    onClickSelectDamageTypeFilter(damageTypes)
  }
  const handleClickSelectVersionGroupId = (id: string) => () => {
    onClickSelectVersionGroupId(id)
  }
  const handleClickSelectFirstGenerationId = (id: string) => () => {
    onClickSelectFirstGenerationId(id)
  }

  const handleClickTriggerFilter = () => {
    setIsOpenFilter((prev) => !prev)
  }

  return (
    <Fragment>
      <ul
        className={`w-full flex gap-3 flex-col justify-evenly will-change-[height] overflow-hidden transition-all duration-200 ${isOpenFilter ? 'h-auto mb-4' : 'h-0'}`}
      >
        <li className="flex flex-row items-center gap-3">
          <p className="shrink-0 text-primary-4 font-semibold text-sm min-w-[4rem] pt-1">
            기술 타입
          </p>
          <div className="w-full min-h-8 flex items-center flex-wrap gap-2 flex-1">
            {Object.entries(PokemonTypes).map(([types, typeName]) => {
              return (
                <button
                  key={types}
                  className={`min-w-[3rem] h-7 px-3 text-sm text-aligned-md rounded-full chip-type-${types.toLowerCase()} will-change-[filter] transition-all ${selectTypeFilter === types ? 'opacity-100 scale-105 ' : 'opacity-60 grayscale hover:opacity-80 hover:grayscale-0'}`}
                  onClick={handleClickSelectTypeFilter(types)}
                >
                  {typeName}
                </button>
              )
            })}
          </div>
        </li>
        <li className="flex flex-row items-center gap-3">
          <p className="shrink-0 text-primary-4 font-semibold text-sm min-w-[4rem] pt-1">
            기술 유형
          </p>
          <div className="flex flex-row items-center gap-3">
            <button
              className={`badge-damage-physical transition-all ${selectDamageTypes === '물리' ? 'opacity-100 scale-105' : 'opacity-60 grayscale hover:opacity-80 hover:grayscale-0'}`}
              onClick={handleClickSelectDamageTypeFilter('물리')}
            >
              물리
            </button>
            <button
              className={`badge-damage-special transition-all ${selectDamageTypes === '특수' ? 'opacity-100 scale-105' : 'opacity-60 grayscale hover:opacity-80 hover:grayscale-0'}`}
              onClick={handleClickSelectDamageTypeFilter('특수')}
            >
              특수
            </button>
            <button
              className={`badge-damage-status transition-all ${selectDamageTypes === '변화' ? 'opacity-100 scale-105' : 'opacity-60 grayscale hover:opacity-80 hover:grayscale-0'}`}
              onClick={handleClickSelectDamageTypeFilter('변화')}
            >
              변화
            </button>
          </div>
        </li>
        <li className="flex flex-row items-center gap-3">
          <p className="shrink-0 text-primary-4 font-semibold text-sm min-w-[4rem] pt-1">
            버전
          </p>
          <div className="flex flex-row items-center flex-wrap gap-3">
            {versionGroups.map((vg) => {
              const vgId = vg.versionGroupId.toString()
              return (
                <button
                  key={`version-filter-key-${vg.versionGroupId}`}
                  className={`px-3 h-7 text-sm text-aligned-md rounded-lg transition-all ${selectVersionGroupId === vgId ? 'opacity-100 scale-105 bg-primary-4 text-primary-1' : 'opacity-60 grayscale bg-primary-3 text-white hover:opacity-80 hover:grayscale-0'}`}
                  onClick={handleClickSelectVersionGroupId(vgId)}
                >
                  {vg.nameKo}
                </button>
              )
            })}
            <span className="text-primary-3 text-sm self-end">
              선택하지 않으면 최신 버전 기준 스펙으로 나와요!
            </span>
          </div>
        </li>
        <li className="flex flex-row items-center gap-3">
          <p className="shrink-0 text-primary-4 font-semibold text-sm min-w-[4rem] pt-1">
            첫 등장 세대
          </p>
          <div className="flex flex-row items-center flex-wrap gap-3">
            {new Array(9).fill('').map((_, index) => {
              const genId = (index + 1).toString()
              return (
                <button
                  key={`generation-filter-key-${index + 1}`}
                  className={`w-14 h-7 text-sm text-aligned-md rounded-lg transition-all ${selectFirstGenerationId === genId ? 'opacity-100 scale-105 bg-primary-4 text-primary-1' : 'opacity-60 grayscale bg-primary-3 text-white hover:opacity-80 hover:grayscale-0'}`}
                  onClick={handleClickSelectFirstGenerationId(genId)}
                >
                  {index + 1}세대
                </button>
              )
            })}
          </div>
        </li>
      </ul>
      <button
        className="w-full h-6 bg-primary-3 rounded-md text-base text-aligned-sm text-center"
        onClick={handleClickTriggerFilter}
      >
        필터 {isOpenFilter ? '닫기' : '열기'}
      </button>
    </Fragment>
  )
}

export default OptionsDesktop
