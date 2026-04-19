'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChampionsMetaStatsFragment } from '~/graphql/typeGenerated'
import ChampionsTierBadge from './ChampionsTierBadge.component'
import ChampionsMetaList from './ChampionsMetaList.component'
import ChampionsPartnerList from './ChampionsPartnerList.component'

interface ChampionsMetaSectionMobileProps {
  meta: ChampionsMetaStatsFragment | null | undefined
}

type TabType = 'moves' | 'items' | 'abilities' | 'partners'

const tabs: { key: TabType; label: string }[] = [
  { key: 'moves', label: '기술' },
  { key: 'items', label: '아이템' },
  { key: 'abilities', label: '특성' },
  { key: 'partners', label: '파트너' },
]

const ChampionsMetaSectionMobile = ({
  meta,
}: ChampionsMetaSectionMobileProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('moves')

  if (!meta) {
    return (
      <div className="p-6 bg-primary-4 rounded-xl text-center">
        <p className="text-primary-2 mb-4">
          아직 메타 데이터가 없습니다.
          <br />
          시즌이 시작되면 업데이트됩니다.
        </p>
        <Link
          href="/champions/list"
          className="inline-block px-4 py-2 bg-primary-1 text-primary-4 rounded-lg hover:bg-primary-2 transition-colors text-sm"
        >
          목록으로 돌아가기
        </Link>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'moves':
        return <ChampionsMetaList title="인기 기술" items={meta.topMoves} />
      case 'items':
        return <ChampionsMetaList title="인기 아이템" items={meta.topItems} />
      case 'abilities':
        return <ChampionsMetaList title="인기 특성" items={meta.topAbilities} />
      case 'partners':
        return (
          <ChampionsPartnerList title="추천 파트너" items={meta.topPartners} />
        )
    }
  }

  return (
    <div className="space-y-4 p-4 bg-primary-4 rounded-xl">
      {meta.isStale && (
        <div className="p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
          데이터가 최신이 아닐 수 있습니다. (업데이트:{' '}
          {new Date(meta.updatedAt).toLocaleDateString('ko-KR')})
        </div>
      )}

      <div className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-sm">
        <ChampionsTierBadge tier={meta.tier} />
        <div className="flex-1 grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-primary-3/20 rounded-lg">
            <p className="text-xs text-primary-2 mb-1">사용률</p>
            <p className="text-xl font-bold text-primary-1">
              {meta.usageRate?.toFixed(1) ?? '-'}%
            </p>
          </div>
          {meta.winRate && (
            <div className="text-center p-2 bg-primary-3/20 rounded-lg">
              <p className="text-xs text-primary-2 mb-1">승률</p>
              <p className="text-xl font-bold text-primary-1">
                {meta.winRate.toFixed(1)}%
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-1 p-1 bg-primary-3/30 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.key
                ? 'bg-primary-1 text-primary-4'
                : 'text-primary-2 hover:bg-primary-3/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>{renderTabContent()}</div>

      <p className="text-xs text-gray-400 text-right">
        출처: <b className="font-bold">{meta.source}</b> <br />
        업데이트:{' '}
        <b className="font-bold">
          {new Date(meta.updatedAt).toLocaleDateString('ko-KR')}
        </b>
      </p>
    </div>
  )
}

export default ChampionsMetaSectionMobile
