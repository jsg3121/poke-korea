interface ChampionsTierBadgeProps {
  tier: string | null | undefined
}

const getTierColor = (tier: string | null | undefined) => {
  switch (tier) {
    case 'S':
      return 'bg-red-500 text-white'
    case 'A':
      return 'bg-orange-500 text-white'
    case 'B':
      return 'bg-yellow-500 text-black'
    case 'C':
      return 'bg-green-500 text-white'
    case 'D':
      return 'bg-gray-500 text-white'
    default:
      return 'bg-gray-300 text-gray-600'
  }
}

const ChampionsTierBadge = ({ tier }: ChampionsTierBadgeProps) => {
  return (
    <div
      className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold ${getTierColor(tier)}`}
    >
      {tier || '-'}
    </div>
  )
}

export default ChampionsTierBadge
