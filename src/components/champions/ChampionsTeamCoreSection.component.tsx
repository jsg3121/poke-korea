'use client'

import { useMemo, useState } from 'react'
import ChampionsHomeSectionHeader from './ChampionsHomeSectionHeader.component'
import ChampionsTeamCoreCard from './ChampionsTeamCoreCard.component'
import { ChampionsTeamCoreFragment } from '~/graphql/typeGenerated'
import { ChampionsFormatSlug } from '~/utils/championsFormat.util'

interface ChampionsTeamCoreSectionProps {
  teamCores: ChampionsTeamCoreFragment[]
  formatSlug: ChampionsFormatSlug
}

type CoreSize = 2 | 3 | 4

const SIZE_OPTIONS: Array<{ value: CoreSize; label: string }> = [
  { value: 2, label: '페어 (2마리)' },
  { value: 3, label: '트리오 (3마리)' },
  { value: 4, label: '스쿼드 (4마리)' },
]

const TOP_N_PER_SIZE = 5

const ChampionsTeamCoreSection = ({
  teamCores,
  formatSlug,
}: ChampionsTeamCoreSectionProps) => {
  const [selectedSize, setSelectedSize] = useState<CoreSize>(2)

  // 사이즈별로 그룹화 + 각 사이즈 내에서 rank 오름차순 정렬 후 TOP N
  const coresBySize = useMemo(() => {
    const map = new Map<CoreSize, ChampionsTeamCoreFragment[]>()
    for (const size of [2, 3, 4] as const) {
      const filtered = teamCores
        .filter((core) => core.size === size)
        .sort((a, b) => a.rank - b.rank)
        .slice(0, TOP_N_PER_SIZE)
      map.set(size, filtered)
    }
    return map
  }, [teamCores])

  const selectedCores = coresBySize.get(selectedSize) ?? []

  if (teamCores.length === 0) {
    return null
  }

  return (
    <section
      aria-labelledby="teamcore-heading"
      className="w-full mb-8 desktop:mb-12"
    >
      <div className="flex items-end justify-between gap-3 mb-4 px-1">
        <div id="teamcore-heading" className="flex-1">
          <ChampionsHomeSectionHeader
            title="인기 포켓몬 조합"
            description="대회에서 자주 쓰이는 포켓몬 조합"
          />
        </div>
        <label className="shrink-0 self-end">
          <span className="sr-only">조합 크기 선택</span>
          <select
            value={selectedSize}
            onChange={(e) =>
              setSelectedSize(Number(e.target.value) as CoreSize)
            }
            className="bg-primary-4 text-primary-1 border-[2px] border-solid border-primary-1 rounded-md px-3 py-1.5 text-sm font-bold cursor-pointer hover:bg-primary-3 transition-colors"
          >
            {SIZE_OPTIONS.map((option) => {
              const count = coresBySize.get(option.value)?.length ?? 0
              const isDisabled = count === 0
              return (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={isDisabled}
                >
                  {option.label}
                  {isDisabled ? ' (없음)' : ''}
                </option>
              )
            })}
          </select>
        </label>
      </div>

      {selectedCores.length === 0 ? (
        <p className="text-center text-sm text-primary-3 py-8">
          선택한 크기의 조합 데이터가 아직 없습니다.
        </p>
      ) : (
        <ul className="flex flex-col gap-4" role="list">
          {selectedCores.map((core) => (
            <li key={core.id}>
              <ChampionsTeamCoreCard core={core} formatSlug={formatSlug} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default ChampionsTeamCoreSection
