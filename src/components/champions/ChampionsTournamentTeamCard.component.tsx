'use client'

import { useState } from 'react'
import ImageComponent from '~/components/Image.component'
import { ChampionsTournamentTeamFragment } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import { ChampionsFormatSlug } from '~/utils/championsFormat.util'
import ChampionsTournamentSlotCard from './ChampionsTournamentSlotCard.component'

interface ChampionsTournamentTeamCardProps {
  team: ChampionsTournamentTeamFragment
  formatSlug: ChampionsFormatSlug
  /** Top 1~3 강조 카드인지 (펼침 고정), 또는 Top 4~8 컴팩트 카드(기본 접힘) */
  variant: 'highlight' | 'compact'
}

/**
 * 순위별 메달 컬러 (1=골드, 2=실버, 3=브론즈, 그 외 = 기본).
 * Phase 3 의 ChampionsTierTeamCoreCard.RANK_BADGE_COLORS 와 일관.
 */
const RANK_BADGE_COLORS: Record<number, string> = {
  1: 'bg-gradient-to-br from-amber-400 to-amber-600',
  2: 'bg-gradient-to-br from-slate-300 to-slate-500',
  3: 'bg-gradient-to-br from-amber-600 to-amber-800',
}

const RANK_BORDER_COLORS: Record<number, string> = {
  1: 'border-amber-500',
  2: 'border-slate-400',
  3: 'border-amber-700',
}

const getRankBadgeColor = (rank: number): string =>
  RANK_BADGE_COLORS[rank] ?? 'bg-primary-1'

const getRankBorderColor = (rank: number): string =>
  RANK_BORDER_COLORS[rank] ?? 'border-primary-1'

const formatRecord = (wins: number, losses: number, ties: number): string => {
  if (ties > 0) return `${wins}승 ${losses}패 ${ties}무`
  return `${wins}승 ${losses}패`
}

const ChampionsTournamentTeamCard = ({
  team,
  formatSlug,
  variant,
}: ChampionsTournamentTeamCardProps) => {
  const [isExpanded, setIsExpanded] = useState(variant === 'highlight')

  const isHighlight = variant === 'highlight'
  const borderClass = isHighlight
    ? getRankBorderColor(team.rank)
    : 'border-primary-1'

  return (
    <article
      className={`w-full bg-primary-4 border-[2px] border-solid ${borderClass} rounded-xl shadow-[0_0_0px_3px_var(--color-primary-4)] p-4`}
      aria-label={`${team.rank}위 ${team.playerName} 팀`}
    >
      <header className="flex items-center gap-3 mb-3">
        {/* 메달 / 순위 뱃지 */}
        {isHighlight ? (
          <span
            className={`flex items-center justify-center w-12 h-12 rounded-full ${getRankBadgeColor(team.rank)} text-white text-xl font-bold shrink-0`}
            aria-hidden="true"
          >
            {team.rank}
          </span>
        ) : (
          <span
            className="inline-flex items-center justify-center bg-primary-1 text-white text-xs font-bold rounded-md px-2 py-1 shrink-0"
            aria-hidden="true"
          >
            #{team.rank}
          </span>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-primary-1 truncate">
            {team.playerName}
          </p>
          <p className="text-xs text-primary-2">
            {formatRecord(team.wins, team.losses, team.ties)}
          </p>
        </div>
      </header>

      {/* 펼침 상태: 풀빌드 6슬롯 그리드 */}
      {isExpanded && (
        <ul
          className="grid grid-cols-2 gap-3"
          aria-label="풀빌드 슬롯"
        >
          {team.slots.map((slot) => (
            <li key={slot.pokemonId ?? slot.rawName}>
              <ChampionsTournamentSlotCard
                slot={slot}
                formatSlug={formatSlug}
              />
            </li>
          ))}
        </ul>
      )}

      {/* 접힘 상태: 포켓몬 이미지 가로 줄 + 펼치기 버튼 */}
      {!isExpanded && (
        <>
          <ul
            className="flex items-center gap-2 mb-3"
            aria-label="팀 포켓몬 미리보기"
          >
            {team.slots.map((slot) => (
              <li
                key={slot.pokemonId ?? slot.rawName}
                className="w-8 h-8 shrink-0"
              >
                {slot.imagePath ? (
                  <ImageComponent
                    src={`${imageMode}/${slot.imagePath}`}
                    alt={`${slot.displayName || slot.rawName} 포켓몬 이미지`}
                    width="2rem"
                    height="2rem"
                    imageSize={{ width: 32, height: 32 }}
                    densities={[1, 1.5]}
                    loading="lazy"
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-primary-3" />
                )}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            aria-expanded={false}
            className="w-full text-sm text-primary-1 font-semibold py-1.5 border border-primary-3 rounded-md hover:bg-primary-3/30 transition-colors"
          >
            풀빌드 펼치기 ▼
          </button>
        </>
      )}

      {/* 펼침 상태에서 컴팩트 카드일 때만 접기 버튼 */}
      {isExpanded && !isHighlight && (
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          aria-expanded={true}
          className="w-full mt-3 text-sm text-primary-1 font-semibold py-1.5 border border-primary-3 rounded-md hover:bg-primary-3/30 transition-colors"
        >
          접기 ▲
        </button>
      )}
    </article>
  )
}

export default ChampionsTournamentTeamCard
