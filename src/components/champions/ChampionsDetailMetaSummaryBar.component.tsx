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
  const hasUsageRank = meta.usageRank != null

  // 데이터 원천이 실게임 데이터로 바뀌며 사용률·승률(%)이 항상 null이 되어, 요약바는
  // 티어·순위(채택 순위)만 노출한다. 인기 기술/도구/특성 top 정보는 바로 아래 본문의
  // 순위 막대(ChampionsMetaList)에 전부 있으므로 요약바에 중복 배치하지 않는다.
  // 표시할 항목이 하나도 없으면 영역 자체 미노출.
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
