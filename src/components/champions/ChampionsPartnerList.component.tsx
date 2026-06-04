import Link from 'next/link'
import { imageMode } from '~/module/buildMode'

interface ChampionsPartnerListProps {
  title: string
  items: Array<{
    pokemonId?: number | null
    rawName?: string
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
        {items.map((item, index) => {
          const displayName = item.name || item.rawName || ''
          const innerContent = (
            <div className="flex items-center justify-between text-sm p-2 -mx-2 rounded-lg hover:bg-primary-3/50 transition-colors">
              <div className="flex items-center gap-3">
                {item.imagePath && (
                  <img
                    src={`${imageMode}/${item.imagePath}`}
                    alt={displayName}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                  />
                )}
                <span className="font-medium">{displayName}</span>
              </div>
              <span className="text-gray-500">
                {item.usageRate}%
              </span>
            </div>
          )

          return (
            <li key={item.pokemonId ?? `${displayName}-${index}`}>
              {item.pokemonId != null ? (
                <Link
                  href={`/champions/list/${item.pokemonId}`}
                  aria-label={`${displayName} 챔피언스 상세보기`}
                >
                  {innerContent}
                </Link>
              ) : (
                innerContent
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ChampionsPartnerList
