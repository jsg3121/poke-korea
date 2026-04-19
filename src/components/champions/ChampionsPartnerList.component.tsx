import Link from 'next/link'
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
    <div className="p-4 bg-primary-3/30 rounded-xl">
      <h3 className="font-bold text-sm mb-3 text-gray-700">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.pokemonId}>
            <Link
              href={`/champions/list/${item.pokemonId}`}
              className="flex items-center justify-between text-sm p-2 -mx-2 rounded-lg hover:bg-primary-3/50 transition-colors"
              aria-label={`${item.name} 챔피언스 상세보기`}
            >
              <div className="flex items-center gap-3">
                {item.imagePath && (
                  <img
                    src={`${imageMode}/${item.imagePath}.webp`}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                  />
                )}
                <span className="font-medium">{item.name}</span>
              </div>
              <span className="text-gray-500">
                {item.usageRate.toFixed(1)}%
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ChampionsPartnerList
