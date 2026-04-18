interface ChampionsTierBadgeProps {
  tier: string | null | undefined
  variant?: 'default' | 'ribbon'
}

export const getTierColors = (tier: string | null | undefined) => {
  switch (tier) {
    case 'S':
      return {
        bg: 'bg-gradient-to-br from-amber-400 to-amber-600',
        border: 'border-amber-400',
        outlineColor: '#fbbf24',
        shadow: 'shadow-amber-400/50',
        text: 'text-white',
      }
    case 'A':
      return {
        bg: 'bg-gradient-to-br from-slate-300 to-slate-500',
        border: 'border-slate-400',
        outlineColor: '#94a3b8',
        shadow: 'shadow-slate-400/50',
        text: 'text-white',
      }
    case 'B':
      return {
        bg: 'bg-gradient-to-br from-amber-600 to-amber-800',
        border: 'border-amber-700',
        outlineColor: '#b45309',
        shadow: 'shadow-amber-700/50',
        text: 'text-white',
      }
    case 'C':
      return {
        bg: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
        border: 'border-emerald-500',
        outlineColor: '#10b981',
        shadow: 'shadow-emerald-500/50',
        text: 'text-white',
      }
    case 'D':
      return {
        bg: 'bg-gradient-to-br from-gray-400 to-gray-600',
        border: 'border-gray-500',
        outlineColor: '#6b7280',
        shadow: 'shadow-gray-500/50',
        text: 'text-white',
      }
    default:
      return {
        bg: 'bg-gray-300',
        border: 'border-gray-300',
        outlineColor: '#d1d5db',
        shadow: '',
        text: 'text-gray-600',
      }
  }
}

const ChampionsTierBadge = ({
  tier,
  variant = 'default',
}: ChampionsTierBadgeProps) => {
  const colors = getTierColors(tier)

  if (variant === 'ribbon') {
    return (
      <div
        className={`absolute -bottom-1 -right-1 w-5 h-5 ${colors.bg} ${colors.text} flex items-center justify-center text-xs font-bold rounded-full shadow-md ${colors.shadow} z-10`}
      >
        {tier || '-'}
      </div>
    )
  }

  return (
    <div
      className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold ${colors.bg} ${colors.text}`}
    >
      {tier || '-'}
    </div>
  )
}

export default ChampionsTierBadge
