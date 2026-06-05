import { ChampionsMetaStatsFragment } from '~/graphql/typeGenerated'
import ChampionsTierBadge from './ChampionsTierBadge.component'

interface ChampionsDetailMetaSummaryBarProps {
  meta: ChampionsMetaStatsFragment | null | undefined
}

const ChampionsDetailMetaSummaryBar = ({
  meta,
}: ChampionsDetailMetaSummaryBarProps) => {
  if (!meta) {
    return null
  }

  const hasTier = Boolean(meta.tier)
  const hasUsageRate = meta.usageRate != null
  const hasWinRate = meta.winRate != null
  const hasUsageRank = meta.usageRank != null

  // 표시할 항목이 하나도 없으면 영역 자체 미노출
  if (!hasTier && !hasUsageRate && !hasWinRate && !hasUsageRank) {
    return null
  }

  return (
    <dl
      aria-label="챔피언스 메타 요약"
      className="mt-4 grid grid-cols-2 desktop:grid-cols-4 gap-2 rounded-lg bg-black-1/20 backdrop-blur-sm px-4 py-3"
    >
      {hasTier && (
        <div className="flex items-center justify-center gap-2">
          <dt className="sr-only">티어</dt>
          <dd>
            <ChampionsTierBadge tier={meta.tier} />
          </dd>
        </div>
      )}

      {hasUsageRate && (
        <div className="flex flex-col items-center text-center">
          <dt className="text-[10px] text-black-2/80 uppercase tracking-wide">
            사용률
          </dt>
          <dd className="text-lg font-bold text-black-2">{meta.usageRate}%</dd>
        </div>
      )}

      <div className="flex flex-col items-center text-center">
        <dt className="text-[10px] text-black-2/80 uppercase tracking-wide">
          승률
        </dt>
        <dd
          className={`text-lg font-bold ${hasWinRate ? 'text-black-2' : 'text-black-2/40'}`}
        >
          {hasWinRate ? `${meta.winRate}%` : '-'}
        </dd>
      </div>

      {hasUsageRank && (
        <div className="flex flex-col items-center text-center">
          <dt className="text-[10px] text-black-2/80 uppercase tracking-wide">
            순위
          </dt>
          <dd className="text-lg font-bold text-black-2">#{meta.usageRank}</dd>
        </div>
      )}
    </dl>
  )
}

export default ChampionsDetailMetaSummaryBar
