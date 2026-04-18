import { imageMode } from '~/module/buildMode'

interface ChampionsPartnerListProps {
  title: string
  items: Array<{
    pokemonId: number
    name: string
    imagePath?: string | null
    usageRate: number
  }>
}

const ChampionsPartnerList = ({ title, items }: ChampionsPartnerListProps) => {
  return (
    <div className="p-4 bg-gray-50 rounded-xl">
      <h3 className="font-bold text-sm mb-3 text-gray-700">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.pokemonId}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              {item.imagePath && (
                <img
                  src={`${imageMode}/${item.imagePath}.webp`}
                  alt={item.name}
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain"
                />
              )}
              <span>{item.name}</span>
            </div>
            <span className="text-gray-500">{item.usageRate.toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ChampionsPartnerList
