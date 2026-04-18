'use client'

import { ChampionsMetaStatsFragment } from '~/graphql/typeGenerated'
import ChampionsTierBadge from './ChampionsTierBadge.component'
import ChampionsMetaList from './ChampionsMetaList.component'
import ChampionsPartnerList from './ChampionsPartnerList.component'

interface ChampionsMetaSectionProps {
  metaStats: ChampionsMetaStatsFragment | null | undefined
}

const ChampionsMetaSection = ({ metaStats }: ChampionsMetaSectionProps) => {
  if (!metaStats) {
    return (
      <div className="p-6 bg-gray-100 rounded-xl">
        <p className="text-gray-500 text-center">
          메타 데이터를 불러올 수 없습니다.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {metaStats.isStale && (
        <div className="p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
          데이터가 최신이 아닐 수 있습니다.
        </div>
      )}

      <div className="flex items-center gap-4">
        <ChampionsTierBadge tier={metaStats.tier} />
        <div>
          <p className="text-sm text-gray-500">사용률</p>
          <p className="text-2xl font-bold">
            {metaStats.usageRate?.toFixed(2) ?? '-'}%
          </p>
        </div>
        {metaStats.winRate && (
          <div>
            <p className="text-sm text-gray-500">승률</p>
            <p className="text-2xl font-bold">
              {metaStats.winRate.toFixed(2)}%
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChampionsMetaList title="인기 기술" items={metaStats.topMoves} />
        <ChampionsMetaList title="인기 아이템" items={metaStats.topItems} />
        <ChampionsMetaList title="인기 특성" items={metaStats.topAbilities} />
        <ChampionsPartnerList
          title="추천 파트너"
          items={metaStats.topPartners}
        />
      </div>

      <p className="text-xs text-gray-400">
        출처: {metaStats.source} | 업데이트:{' '}
        {new Date(metaStats.updatedAt).toLocaleDateString('ko-KR')}
      </p>
    </div>
  )
}

export default ChampionsMetaSection
