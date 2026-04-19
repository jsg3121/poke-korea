'use client'

import { ChampionsMetaStatsFragment } from '~/graphql/typeGenerated'
import ChampionsTierBadge from './ChampionsTierBadge.component'
import ChampionsMetaList from './ChampionsMetaList.component'
import ChampionsPartnerList from './ChampionsPartnerList.component'

interface ChampionsMetaSectionProps {
  meta: ChampionsMetaStatsFragment | null | undefined
}

const ChampionsMetaSection = ({ meta }: ChampionsMetaSectionProps) => {
  if (!meta) {
    return (
      <div className="p-6 bg-gray-100 rounded-xl">
        <p className="text-gray-500 text-center">
          메타 데이터를 불러올 수 없습니다.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-primary-4 rounded-xl">
      {meta.isStale && (
        <div className="p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
          데이터가 최신이 아닐 수 있습니다. (업데이트:{' '}
          {new Date(meta.updatedAt).toLocaleDateString('ko-KR')})
        </div>
      )}

      <div className="flex items-center gap-6 p-4 bg-white rounded-xl shadow-sm">
        <ChampionsTierBadge tier={meta.tier} />
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-primary-3/20 rounded-lg">
            <p className="text-xs text-primary-2 mb-1">사용률</p>
            <p className="text-2xl font-bold text-primary-1">
              {meta.usageRate?.toFixed(1) ?? '-'}%
            </p>
          </div>
          {meta.winRate && (
            <div className="text-center p-3 bg-primary-3/20 rounded-lg">
              <p className="text-xs text-primary-2 mb-1">승률</p>
              <p className="text-2xl font-bold text-primary-1">
                {meta.winRate.toFixed(1)}%
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <ChampionsMetaList title="인기 기술" items={meta.topMoves} />
        <ChampionsMetaList title="인기 아이템" items={meta.topItems} />
        <ChampionsMetaList title="인기 특성" items={meta.topAbilities} />
        <ChampionsPartnerList title="추천 파트너" items={meta.topPartners} />
      </div>

      <p className="text-xs text-gray-400 text-right">
        출처: {meta.source} | 업데이트:{' '}
        {new Date(meta.updatedAt).toLocaleDateString('ko-KR')}
      </p>
    </div>
  )
}

export default ChampionsMetaSection
