import { ChampionsMetaStatsFragment } from '~/graphql/typeGenerated'
import ChampionsTierBadge from '~/components/common/ChampionsTierBadge.component'

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
  const hasUsageRank = meta.usageRank != null

  if (!hasTier && !hasUsageRank) {
    return null
  }

  return (
    <dl
      aria-label="챔피언스 메타 요약"
      className="mt-4 flex items-center justify-center gap-6 desktop:gap-10 rounded-lg bg-black-1/20 backdrop-blur-sm px-4 py-3"
    >
      {hasTier && (
        <div className="flex flex-col items-center gap-1 text-center">
          <dt className="text-[10px] text-black-2/80 uppercase tracking-wide">
            티어
          </dt>
          <dd>
            <ChampionsTierBadge tier={meta.tier} />
          </dd>
        </div>
      )}

      {hasUsageRank && (
        <div className="flex flex-col items-center gap-1 text-center">
          <dt className="text-[10px] text-black-2/80 uppercase tracking-wide">
            채택 순위
          </dt>
          <dd className="text-lg desktop:text-2xl font-bold text-black-2 leading-none">
            #{meta.usageRank}
          </dd>
        </div>
      )}
    </dl>
  )
}

export default ChampionsDetailMetaSummaryBar
