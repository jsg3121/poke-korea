interface ChampionsPartnerListProps {
  title: string
  items: Array<{ pokemonId: number; name: string; usageRate: number }>
}

const ChampionsPartnerList = ({ title, items }: ChampionsPartnerListProps) => {
  return (
    <div className="p-4 bg-gray-50 rounded-xl">
      <h3 className="font-bold text-sm mb-3 text-gray-700">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.pokemonId} className="flex justify-between text-sm">
            <span>{item.name}</span>
            <span className="text-gray-500">{item.usageRate.toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ChampionsPartnerList
