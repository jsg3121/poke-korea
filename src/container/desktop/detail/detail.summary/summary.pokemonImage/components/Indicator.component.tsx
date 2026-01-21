'use client'

import Link from 'next/link'
import { TActiveType } from '~/types/detailContext.type'
import { getFormUrl } from '../module/image.module'

interface IndicatorComponentProps {
  activeType: TActiveType
  pokemonNumber: number
  totalCount: number
  activeIndex: number
  isShiny: boolean
}

const IndicatorComponent = ({
  activeType,
  pokemonNumber,
  totalCount,
  activeIndex,
  isShiny,
}: IndicatorComponentProps) => {
  return (
    <i className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
      {new Array(totalCount).map((_, index) => (
        <Link
          key={`indicator-${index}`}
          href={getFormUrl({
            activeIndex: index,
            pokemonNumber,
            activeType,
            isShiny,
          })}
          className={`w-3 h-3 rounded-full transition-all ${
            index === activeIndex
              ? 'bg-white scale-125'
              : 'bg-white/40 hover:bg-white/70'
          }`}
          aria-label={`폼 ${index + 1}로 이동`}
          aria-current={index === activeIndex ? 'true' : undefined}
        />
      ))}
    </i>
  )
}

export default IndicatorComponent
