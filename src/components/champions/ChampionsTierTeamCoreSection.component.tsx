import ChampionsTierTeamCoreCard from './ChampionsTierTeamCoreCard.component'
import { ChampionsTeamCoreFragment } from '~/graphql/typeGenerated'
import { ChampionsFormatSlug } from '~/utils/championsFormat.util'

interface ChampionsTierTeamCoreSectionProps {
  teamCores: ChampionsTeamCoreFragment[]
  formatSlug: ChampionsFormatSlug
}

type CoreSize = 2 | 3 | 4

const SIZE_LABELS: Record<CoreSize, string> = {
  2: '페어 TOP 3',
  3: '트리오 TOP 3',
  4: '스쿼드 TOP 3',
}

const TOP_N = 3

/**
 * 사이즈별 그룹화 + rank 오름차순 정렬 후 TOP N 추출
 */
const groupBySize = (
  cores: ChampionsTeamCoreFragment[],
): Map<CoreSize, ChampionsTeamCoreFragment[]> => {
  const map = new Map<CoreSize, ChampionsTeamCoreFragment[]>()
  for (const size of [2, 3, 4] as const) {
    const filtered = cores
      .filter((core) => core.size === size)
      .sort((a, b) => a.rank - b.rank)
      .slice(0, TOP_N)
    map.set(size, filtered)
  }
  return map
}

const ChampionsTierTeamCoreSection = ({
  teamCores,
  formatSlug,
}: ChampionsTierTeamCoreSectionProps) => {
  if (teamCores.length === 0) {
    return null
  }

  const coresBySize = groupBySize(teamCores)
  const sizes: CoreSize[] = [2, 3, 4]
  const hasAnyCore = sizes.some(
    (size) => (coresBySize.get(size)?.length ?? 0) > 0,
  )

  if (!hasAnyCore) {
    return null
  }

  return (
    <section aria-labelledby="team-core-heading" className="w-full mb-8">
      <h2
        id="team-core-heading"
        className="text-xl font-bold text-primary-4 mb-4"
      >
        최신 인기 조합
      </h2>
      <div className="grid grid-cols-1 desktop:grid-cols-3 gap-6">
        {sizes.map((size) => {
          const cores = coresBySize.get(size) ?? []
          if (cores.length === 0) return null
          return (
            <div key={size}>
              <h3 className="text-sm font-bold text-primary-3 mb-2">
                {SIZE_LABELS[size]}
              </h3>
              <ul className="flex flex-col gap-4" role="list">
                {cores.map((core) => (
                  <li key={core.id}>
                    <ChampionsTierTeamCoreCard
                      core={core}
                      formatSlug={formatSlug}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default ChampionsTierTeamCoreSection
