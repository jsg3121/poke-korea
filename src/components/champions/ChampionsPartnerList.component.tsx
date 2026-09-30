import Link from 'next/link'

import {
  buildChampionsDetailHref,
  ChampionsFormatSlug,
} from '~/utils/championsFormat.util'
import { imageMode } from '~/modules/buildMode.module'
import Image from '~/components/Image.component'

interface ChampionsPartnerListProps {
  title: string
  items: Array<{
    pokemonId?: number | null
    rawName?: string
    name: string
    imagePath?: string | null
    usageRate: number
    formType?: string | null
    formCode?: string | null
  }>
  formatSlug: ChampionsFormatSlug
}

const ChampionsPartnerList = ({
  title,
  items,
  formatSlug,
}: ChampionsPartnerListProps) => {
  return (
    <div className="p-3 bg-primary-3/25 rounded-lg">
      <h3 className="font-bold text-sm mb-3 text-primary-1">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => {
          const displayName = item.name || item.rawName || ''
          const isLink = item.pokemonId != null

          const innerContent = (
            <div className="group flex items-center justify-between gap-2 text-sm p-2 -mx-1 rounded-lg hover:bg-primary-4/80 transition-colors">
              <div className="flex min-w-0 items-center gap-3">
                {item.imagePath && (
                  <Image
                    src={`${imageMode}/${item.imagePath}`}
                    alt={displayName}
                    width="2.5rem"
                    height="2.5rem"
                    imageSize={{ width: 40, height: 40 }}
                    densities={[1, 1.5]}
                    loading="lazy"
                    className="w-10 h-10 shrink-0 object-contain"
                  />
                )}
                <span className="font-medium text-primary-1 break-keep">
                  {displayName}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <span className="font-semibold text-primary-2">
                  {item.usageRate}%
                </span>
                {isLink && (
                  <span
                    aria-hidden="true"
                    className="text-primary-2 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    →
                  </span>
                )}
              </div>
            </div>
          )

          return (
            <li
              key={`${item.pokemonId}-${displayName}-${index}-${item.formType}`}
            >
              {isLink ? (
                <Link
                  href={buildChampionsDetailHref({
                    formatSlug,
                    pokemonId: item.pokemonId as number,
                    formType: item.formType,
                    formCode: item.formCode,
                  })}
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
